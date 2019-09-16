import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DocumentForm from './DocumentForm';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Box, Button, Heading } from 'grommet';
import { LinkPrevious, Money } from 'grommet-icons';
import { canWriteToDoc } from '../common/models/user';
import { Preloader } from '../components/Preloader';
import { Document } from '../common/models/document';
import { SecondaryHeader } from '../components/SecondaryHeader';
import { Schema } from '../common/models/schema';
import { Contact } from '../common/models/contact';
import { Modal } from '@centrifuge/axis-modal';
import MintNftForm, { MintNftFormData } from './MintNftForm';
import { httpClient } from '../http-client';
import { AppContext } from '../App';
import { useMergeState } from '../hooks';
import { PageError } from '../components/PageError';
import documentRoutes from './routes';
import { NOTIFICATION, NotificationContext } from '../components/notifications/NotificationContext';
import { AxiosError } from 'axios';

type Props = RouteComponentProps<{ id: string }>;


type State = {
  loadingMessage: string | null
  mintingOpened: boolean;
  document?: Document;
  schemas: Schema[];
  contacts: Contact[];
  error?: any;
}


const EditDocument: FunctionComponent<Props> = (props: Props) => {

  const {
    match: {
      params: {
        id,
      },
    },
  } = props;
  const [
    {
      loadingMessage,
      contacts,
      document,
      schemas,
      mintingOpened,
      error,
    },
    setState] = useMergeState<State>({
    loadingMessage: 'Loading',
    mintingOpened: false,
    schemas: [],
    contacts: [],
  });

  const { user } = useContext(AppContext);
  const notification = useContext(NotificationContext);


  const handleHttpClientError = useCallback((error) => {
    setState({
      loadingMessage: null,
      error,
    });
  }, [setState]);

  const loadData = useCallback(async (id: string) => {
    setState({
      loadingMessage: 'Loading',
    });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      const schemas = (await httpClient.schemas.list()).data;
      const document = (await httpClient.documents.getById(id)).data;
      setState({
        loadingMessage: null,
        contacts,
        schemas,
        document,
      });

    } catch (e) {
      handleHttpClientError(e);
    }
  }, [setState, handleHttpClientError]);


  useEffect(() => {
    loadData(id);
  }, [id, loadData]);


  const updateDocument = async (newDoc: Document) => {
    setState({
      loadingMessage: 'Updating document',
    });
    try {
      const document = (await httpClient.documents.update(newDoc)).data;
      setState({
        loadingMessage: null,
        document,
      });
    } catch (e) {
      setState({
        loadingMessage: null,
      });


      notification.alert({
        type: NOTIFICATION.ERROR,
        title: ' Failed to update document',
        message: (e as AxiosError)!.response!.data.message,
      });
    }

  };

  const mintNFT = async (id: string | undefined, data: MintNftFormData) => {

    setState({
      loadingMessage: 'Minting NFT',
      mintingOpened: false,
    });

    try {
      const document = (await httpClient.documents.mint(
        id,
        {
          deposit_address: data.transfer ? data.deposit_address : user!.account,
          proof_fields: data.registry!.proofs,
          registry_address: data.registry!.address,
        },
      )).data;

      setState({
        loadingMessage: null,
        document,
      });

    } catch (e) {
      setState({
        loadingMessage: null,
      });

      notification.alert({
        type: NOTIFICATION.ERROR,
        title: ' Failed to mint NFT',
        message: (e as AxiosError)!.response!.data.message,
      });
    }
  };


  const openMintModal = () => {
    setState({ mintingOpened: true });
  };

  const closeMintModal = () => {
    setState({ mintingOpened: false });
  };

  const onCancel = () => {
    props.history.goBack();
  };


  if (loadingMessage) {
    return <Preloader message={loadingMessage}/>;
  }

  if (error)
    return <PageError error={error}/>;

  // Redirect to view in case the user can not edit this document
  if (!canWriteToDoc(user!, document)) {
    return <Redirect to={documentRoutes.view.replace(':id', id)}/>;
  }

  const selectedSchema: Schema | undefined = schemas.find(s => {
    return (
      document &&
      document.attributes &&
      document.attributes._schema &&
      s.name === document.attributes._schema.value
    );
  });

  if (!selectedSchema) return <p>Unsupported schema</p>;

  // Add mint action if schema has any registries defined
  const mintActions = selectedSchema.registries && selectedSchema.registries.length > 0 ? [
      <Button key="mint_nft" onClick={openMintModal} icon={<Money/>} plain label={'Mint NFT'}/>,
    ] : []
  ;
  return (
    <>
      <Modal
        width={'large'}
        opened={mintingOpened}
        headingProps={{ level: 3 }}
        title={`Mint NFT`}
        onClose={closeMintModal}
      >
        <MintNftForm
          onSubmit={(data) => mintNFT(document!._id, data)}
          onDiscard={closeMintModal}
          registries={selectedSchema.registries}
        />
      </Modal>

      <DocumentForm
        onSubmit={updateDocument}
        selectedSchema={selectedSchema}
        mode={'edit'}
        contacts={contacts}
        document={document}
        schemas={schemas}
        mintActions={mintActions}
      >
        <SecondaryHeader>
          <Box direction="row" gap="small" align="center">
            <Link to={documentRoutes.index} size="large">
              <LinkPrevious/>
            </Link>
            <Heading level="3">
              {'Update Document'}
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
              label="Update"
            />

          </Box>
        </SecondaryHeader>
      </DocumentForm>
    </>
  );

};


export default withRouter(EditDocument);
