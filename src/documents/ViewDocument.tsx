import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Heading } from 'grommet';
import { LabelValuePair } from '../common/interfaces';
import { connect } from 'react-redux';
import { CoreapiDocumentResponse } from '../../clients/centrifuge-node';
import { getContacts, resetGetContacts } from '../store/actions/contacts';
import { RouteComponentProps, withRouter } from 'react-router';
import { LinkPrevious } from 'grommet-icons';
import routes from '../routes';
import { documentRoutes } from './routes';
import { Preloader } from '../components/Preloader';
import { SecondaryHeader } from '../components/SecondaryHeader';
import { mapContactsToLabelKeyPair } from '../store/derived-data';
import DocumentForm from './DocumentForm';
import { getDocumentById, resetGetDocumentById } from '../store/actions/documents';
import { getSchemasList, resetGetSchemasList } from '../store/actions/schemas';
import { Schema } from '../common/models/schema';


type Props = {
  getDocumentById: typeof getDocumentById
  resetGetDocumentById: typeof resetGetDocumentById;
  getContacts: typeof getContacts;
  resetGetContacts: typeof resetGetContacts;
  getSchemasList: typeof getSchemasList
  resetGetSchemasList: typeof resetGetSchemasList
  document: CoreapiDocumentResponse & { _id: string };
  contacts?: LabelValuePair[];
  schemas: Schema[];

} & RouteComponentProps<{ id?: string }>;

export class ViewDocument extends React.Component<Props> {

  displayName = 'InvoiceView';
  state = {
    requestFunding: false,
    addTransferDetails: false,
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getContacts();
      this.props.getSchemasList();
      this.props.getDocumentById(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.resetGetContacts();
    this.props.resetGetSchemasList();
    this.props.resetGetDocumentById();
  }

  render() {
    const {
      document,
      contacts,
      schemas
    } = this.props;

    if (!document || !contacts || !schemas || !document.attributes) {
      return <Preloader message="Loading"/>;
    }

    return (
      <>
        <Box pad={{ bottom: 'large' }}>
          <SecondaryHeader>
            <Box direction="row" gap="small" align="center">
              <Link to={routes.documents.index} size="large">
                <LinkPrevious/>
              </Link>

              <Heading level="3">
                Document #{document!.attributes!.reference_id!.value}
              </Heading>
            </Box>
            <Box direction="row" gap="medium">
              <Button
                onClick={() => {
                   this.props.history.push(
                    documentRoutes.edit.replace(':id', document!._id),
                  );
                }}
                label="Edit"
              />
            </Box>
          </SecondaryHeader>

          <DocumentForm
            document={document}
            mode={'view'}
            schemas={schemas}
            contacts={contacts}/>
        </Box>
      </>
    );

  }
}


const mapStateToProps = (state) => {
  return {
    document: state.documents.getById.data,
    creatingFunding: state.funding.create,
    contacts: mapContactsToLabelKeyPair(state),
    schemas: state.schemas.getList.data,
  };
};

export default connect(
  mapStateToProps,
  {
    getContacts,
    resetGetContacts,
    getDocumentById,
    resetGetDocumentById,
    getSchemasList,
    resetGetSchemasList,

  },
)(withRouter(ViewDocument));


