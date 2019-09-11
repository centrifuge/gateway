import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DocumentForm from './DocumentForm';
import { RouteComponentProps, withRouter } from 'react-router';
import { Box, Button, Heading } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { Preloader } from '../components/Preloader';
import { SecondaryHeader } from '../components/SecondaryHeader';
import { documentRoutes } from './routes';
import { Schema } from '../common/models/schema';
import { Contact } from '../common/models/contact';
import { Document } from '../common/models/document';
import { httpClient } from '../http-client';
import { User } from '../common/models/user';
import { mapSchemaNames } from '../common/schema-utils';

type Props = {
  loggedInUser: User;
} & RouteComponentProps;


type State = {
  defaultDocument: Document,
  loading: boolean,
  savingDocument: boolean,
  error: any,
  contacts: Contact[];
  schemas: Schema[];
}

export class CreateDocument extends React.Component<Props, State> {

  state = {
    defaultDocument: {
      attributes: {},
    },
    loading: true,
    savingDocument: false,
    error: null,
    contacts: [],
    schemas: [],
  };

  async componentDidMount() {
    await this.loadData();
  }

  handleHttpClientError = (error) => {
    this.setState({
      loading: false,
      savingDocument: false,
      error
    });
  };

  loadData = async () => {
    this.setState({
      loading: true,
    });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      const schemas = (await httpClient.schemas.list({ archived: { $exists: false, $ne: true } })).data;
      this.setState({
        contacts,
        schemas,
        loading: false,
      });
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };


  createDocument = async (document: Document) => {
    this.setState({
      savingDocument: true,

    });
    try {
      const doc = (await httpClient.documents.create(document)).data;
      this.props.history.push(documentRoutes.view.replace(':id', doc._id));

    } catch (e) {
      this.handleHttpClientError(e);
    }

  };

  onCancel = () => {
    this.props.history.push(documentRoutes.index);
  };

  render() {
    const {loggedInUser} = this.props;
    const { defaultDocument, contacts, schemas, loading, savingDocument } = this.state;

    if (loading) {
      return <Preloader message="Loading"/>;
    }

    if (savingDocument) {
      return <Preloader message="Saving document"/>;
    }

    const availableSchemas = mapSchemaNames(loggedInUser.schemas, schemas);

    return (
      <DocumentForm
        document={defaultDocument}
        schemas={availableSchemas}
        onSubmit={this.createDocument}
        contacts={contacts}
      >
        <SecondaryHeader>
          <Box direction="row" gap="small" align="center">
            <Link to={documentRoutes.index} size="large">
              <LinkPrevious/>
            </Link>
            <Heading level="3">
              {'New Document'}
            </Heading>
          </Box>

          <Box direction="row" gap="medium">
            <Button
              onClick={this.onCancel}
              label="Discard"
            />

            <Button
              type="submit"
              primary
              label="Save"
            />
          </Box>
        </SecondaryHeader>
      </DocumentForm>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.user.auth.loggedInUser,
  };
};

export default connect(
  mapStateToProps
  ,
)(withRouter(CreateDocument));


