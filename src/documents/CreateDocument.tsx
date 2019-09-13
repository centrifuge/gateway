import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { mapSchemaNames } from '../common/schema-utils';
import { NotificationContext } from '../components/notifications/NotificationContext';
import { AppContext } from '../App';
import { useMergeState } from '../hooks';

type Props = {} & RouteComponentProps;


type State = {
  defaultDocument: Document,
  loading: boolean,
  savingDocument: boolean,
  error: any,
  contacts: Contact[];
  schemas: Schema[];
}

export const CreateDocument: FunctionComponent<Props> = (props) => {

  const [{ defaultDocument, contacts, schemas, loading, savingDocument }, setState] = useMergeState<State>(
    {
      defaultDocument: {
        attributes: {},
      },
      loading: true,
      savingDocument: false,
      error: null,
      contacts: [],
      schemas: [],
    },
  );

  const {
    history: {
      push,
    },
  } = props;


  const notification = useContext(NotificationContext);
  const { user } = useContext(AppContext);


  const handleHttpClientError = useCallback((error) => {
    setState({
      loading: false,
      savingDocument: false,
      error,
    });
  }, [setState]);

  const loadData = useCallback(async () => {
    setState({
      loading: true,
    });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      const schemas = (await httpClient.schemas.list({ archived: { $exists: false, $ne: true } })).data;
      setState({
        contacts,
        schemas,
        loading: false,
      });

      notification.notify({ title: 'Complete', message: 'DDDD' });

    } catch (e) {
      handleHttpClientError(e);
    }
  }, [setState, handleHttpClientError, notification]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const createDocument = async (document: Document) => {
    setState({
      savingDocument: true,
    });
    try {
      const doc = (await httpClient.documents.create(document)).data;
      props.history.push(documentRoutes.view.replace(':id', doc._id));

    } catch (error) {
      setState({
        loading: false,
        savingDocument: false,
        error,
      });
    }

  };

  const onCancel = () => {
    push(documentRoutes.index);
  };

  if (loading) {
    return <Preloader message="Loading"/>;
  }

  if (savingDocument) {
    return <Preloader message="Saving document"/>;
  }

  const availableSchemas = mapSchemaNames(user!.schemas, schemas);

  return (
    <DocumentForm
      document={defaultDocument}
      schemas={availableSchemas}
      onSubmit={createDocument}
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
            onClick={onCancel}
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

};


export default withRouter(CreateDocument);


