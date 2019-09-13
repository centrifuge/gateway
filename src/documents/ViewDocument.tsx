import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Document } from '../common/models/document';
import { RouteComponentProps, withRouter } from 'react-router';
import { LinkPrevious } from 'grommet-icons';
import routes from '../routes';
import { documentRoutes } from './routes';
import { Preloader } from '../components/Preloader';
import { SecondaryHeader } from '../components/SecondaryHeader';
import DocumentForm from './DocumentForm';
import { Schema } from '../common/models/schema';
import { Contact } from '../common/models/contact';
import { canWriteToDoc, User } from '../common/models/user';
import { httpClient } from '../http-client';
import { AppContext } from '../App';
import { useMergeState } from '../hooks';


type Props = {
  loggedInUser: User;
} & RouteComponentProps<{ id: string }>;

type State = {
  loading: boolean;
  document?: Document;
  contacts: Contact[];
  schemas: Schema[];
  error: any,
}


export const ViewDocument: FunctionComponent<Props> = (props: Props) => {

  const [{ loading, contacts, document, schemas }, setState] = useMergeState<State>({
    loading: true,
    contacts: [],
    schemas: [],
    error: null,
  });
  const { user } = useContext(AppContext);
  const {
    match: {
      params: {
        id,
      },
    },
    history: {
      push,
    },
  } = props;


  useEffect(() => {

    const handleHttpClientError = (error) => {
      setState({
        loading: false,
        error,
      });
    };

    const loadData = async (id: string) => {
      setState({
        loading: true,
      });
      try {
        const contacts = (await httpClient.contacts.list()).data;
        const schemas = (await httpClient.schemas.list()).data;
        const document = (await httpClient.documents.getById(id)).data;
        setState({
          loading: false,
          contacts,
          schemas,
          document,
        });

      } catch (e) {
        handleHttpClientError(e);
      }
    };

    loadData(id);
  }, [id,setState]);


  if (loading) {
    return <Preloader message="Loading"/>;
  }

  if (!document) {
    return <Paragraph color="status-error"> Failed to load document </Paragraph>;
  }

  const selectedSchema: Schema | undefined = schemas.find(s => {
    return (
      document.attributes &&
      document.attributes._schema &&
      s.name === document.attributes._schema.value
    );
  });

  if (!selectedSchema) return <p>Unsupported schema</p>;

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
            {canWriteToDoc(user, document) && <Button
              onClick={() => {
                push(
                  documentRoutes.edit.replace(':id', id),
                );
              }}
              label="Edit"
            />}
          </Box>
        </SecondaryHeader>

        <DocumentForm
          selectedSchema={selectedSchema}
          document={document}
          mode={'view'}
          schemas={schemas}
          contacts={contacts}/>
      </Box>
    </>
  );

};


export default withRouter(ViewDocument);


