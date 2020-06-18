import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentForm from './DocumentForm';
import { RouteComponentProps, withRouter } from 'react-router';
import { Box, Button, Heading } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import { SecondaryHeader } from '../components/SecondaryHeader';
import documentRoutes from './routes';
import { Schema } from '@centrifuge/gateway-lib/models/schema';
import { Contact } from '@centrifuge/gateway-lib/models/contact';
import { Document } from '@centrifuge/gateway-lib/models/document';
import { httpClient } from '../http-client';
import { mapSchemaNames } from '@centrifuge/gateway-lib/utils/schema-utils';
import {NOTIFICATION, NotificationContext} from '../components/NotificationContext';
import { AppContext } from '../App';
import { useMergeState } from '../hooks';
import { PageError } from '../components/PageError';
import {AxiosError} from "axios";

type Props = RouteComponentProps;


type State = {
  defaultDocument: Document,
  error: any,
  contacts: Contact[];
  schemas: Schema[];
}

export const CreateDocument: FunctionComponent<Props> = (props) => {

  const [{ defaultDocument, contacts, schemas, error }, setState] = useMergeState<State>(
    {
      defaultDocument: {
        attributes: {},
      },
      error: null,
      contacts: [],
      schemas: [],
    },
  );

  const {
    history: {
      push,
      go
    },
  } = props;


  const notification = useContext(NotificationContext);
  const { user } = useContext(AppContext);


  const displayPageError = useCallback((error) => {
    setState({
      error,
    });
  }, [setState]);

  const loadData = useCallback(async () => {
    setState({
    });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      const schemas = (await httpClient.schemas.list({ archived: { $exists: false, $ne: true } })).data;
      setState({
        contacts,
        schemas,
      });
    } catch (e) {
      displayPageError(e);
    }
  }, [setState, displayPageError]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const createDocument = async (document: Document) => {
    setState({
      defaultDocument: document,
    });

    try {
      push(documentRoutes.index);
      go(0);
      await httpClient.documents.create(document);
    } catch (e) {
      notification.alert({
        type: NOTIFICATION.ERROR,
        title: 'Failed to save document',
        message: (e as AxiosError)!.response!.data.message,
      });
    }
  };

  const onCancel = () => {
    push(documentRoutes.index);
    go(0);
  };

  if (error)
    return <PageError error={error}/>;

  const availableSchemas = mapSchemaNames(user!.schemas, schemas);

  return (
    <DocumentForm
      document={defaultDocument}
      schemas={availableSchemas}
      onSubmit={createDocument}
      mode={'create'}
      contacts={contacts}
      renderHeader={() => {
        return <SecondaryHeader>
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
        </SecondaryHeader>;
      }}
    >
    </DocumentForm>
  );
};

export default withRouter(CreateDocument);


