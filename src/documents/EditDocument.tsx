import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DocumentForm from './DocumentForm';
import { RouteComponentProps, withRouter } from 'react-router';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { documentRoutes } from './routes';
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

type Props = {} & RouteComponentProps<{ id: string }>;


type State = {
  loading: boolean
  mintingOpened: boolean;
  document?: Document;
  schemas: Schema[];
  contacts: Contact[];
  updatingDocument: boolean;
  mintingNFT: boolean;
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
      loading,
      updatingDocument,
      mintingNFT,
      contacts,
      document,
      schemas,
      mintingOpened,
    },
    setState] = useMergeState<State>({
    loading: false,
    mintingOpened: false,
    schemas: [],
    contacts: [],
    updatingDocument: false,
    mintingNFT: false,
  });

  const { user } = useContext(AppContext);


  const handleHttpClientError = useCallback((error) => {
    setState({
      loading: false,
      mintingNFT: false,
      updatingDocument: false,
      error,
    });
  }, [setState]);

  const loadData = useCallback(async (id: string) => {
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
  }, [setState, handleHttpClientError]);


  useEffect(() => {
    loadData(id);
  }, [id, loadData]);


  const updateDocument = async (newDoc: Document) => {
    setState({
      updatingDocument: true,
    });
    try {
      const document = (await httpClient.documents.update(newDoc)).data;
      setState({
        updatingDocument: false,
        document,
      });
    } catch (e) {
      handleHttpClientError(e);
    }

  };

  const mintNFT = async (id: string | undefined, data: MintNftFormData) => {


    setState({
      mintingOpened: false,
      mintingNFT: true,
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
        mintingNFT: false,
        document,
      });

    } catch (e) {
      handleHttpClientError(e);
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


  if (loading) {
    return <Preloader message="Loading"/>;
  }

  if (updatingDocument) {
    return <Preloader message="Updating document"/>;
  }


  if (mintingNFT) {
    return <Preloader message="Minting NFT"/>;
  }

  if (!document) {
    return <Paragraph color="status-error"> Failed to load document </Paragraph>;
  }

  // TODO add route resolvers and remove this logic
  if (!canWriteToDoc(user!, document)) {
    return <Paragraph color="status-error"> Access Denied! </Paragraph>;
  }

  const selectedSchema: Schema | undefined = schemas.find(s => {
    return (
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
