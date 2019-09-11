import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import DocumentForm from './DocumentForm';
import { RouteComponentProps, withRouter } from 'react-router';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { documentRoutes } from './routes';
import { LinkPrevious, Money } from 'grommet-icons';
import { canWriteToDoc, User } from '../common/models/user';
import { Preloader } from '../components/Preloader';
import { Document } from '../common/models/document';
import { SecondaryHeader } from '../components/SecondaryHeader';
import { Schema } from '../common/models/schema';
import { Contact } from '../common/models/contact';
import { Modal } from '@centrifuge/axis-modal';
import MintNftForm, { MintNftFormData } from './MintNftForm';
import { httpClient } from '../http-client';

type Props = {
  loggedInUser: User;
} & RouteComponentProps<{ id: string }>;


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


export class EditDocument extends React.Component<Props, State> {

  state = {
    loading: false,
    mintingOpened: false,
    schemas: [],
    contacts: [],
    updatingDocument: false,
    mintingNFT: false,
  } as State;

  async componentDidMount() {
    await this.loadData(this.props.match.params.id);
  }

  handleHttpClientError = (error) => {
    this.setState({
      loading: false,
      mintingNFT: false,
      updatingDocument: false,
      error,
    });
  };


  loadData = async (id: string) => {
    this.setState({
      loading: true,
    });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      const schemas = (await httpClient.schemas.list()).data;
      const document = (await httpClient.documents.getById(id)).data;
      this.setState({
        loading: false,
        contacts,
        schemas,
        document,
      });

    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  updateDocument = async (newDoc: Document) => {
    this.setState({
      updatingDocument: true,
    });
    try {
      const document = (await httpClient.documents.update(newDoc)).data;
      this.setState({
        updatingDocument: false,
        document,
      });
    } catch (e) {
      this.handleHttpClientError(e);
    }

  };

  mintNFT = async (id: string | undefined, data: MintNftFormData) => {

    const { loggedInUser } = this.props;

    this.setState({
      mintingOpened: false,
      mintingNFT: true,
    });

    try {
      const document = (await httpClient.documents.mint(
        id,
        {
          deposit_address: data.transfer ? data.deposit_address : loggedInUser.account,
          proof_fields: data.registry!.proofs,
          registry_address: data.registry!.address,
        },
      )).data;

      this.setState({
        mintingNFT: false,
        document,
      });

    } catch (e) {
      this.handleHttpClientError(e);
    }
  };


  openMintModal = () => {
    this.setState({ mintingOpened: true });
  };

  closeMintModal = () => {
    this.setState({ mintingOpened: false });
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      loggedInUser,
    } = this.props;

    const {
      loading,
      updatingDocument,
      mintingNFT,
      contacts,
      document,
      schemas,
      mintingOpened,
    } = this.state;


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
    if (!canWriteToDoc(loggedInUser, document)) {
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
        <Button key="mint_nft" onClick={this.openMintModal} icon={<Money/>} plain label={'Mint NFT'}/>,
      ] : []
    ;
    return (
      <>
        <Modal
          width={'large'}
          opened={mintingOpened}
          headingProps={{ level: 3 }}
          title={`Mint NFT`}
          onClose={this.closeMintModal}
        >
          <MintNftForm
            onSubmit={(data) => this.mintNFT(document!._id, data)}
            onDiscard={this.closeMintModal}
            registries={selectedSchema.registries}
          />
        </Modal>

        <DocumentForm
          onSubmit={this.updateDocument}
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
                onClick={this.onCancel}
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
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state.user.auth.loggedInUser,

  };
};

export default connect(
  mapStateToProps,
)(withRouter(EditDocument));
