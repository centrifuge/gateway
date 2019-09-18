import React, { FunctionComponent, useContext } from 'react';
import { useMergeState } from '../hooks';
import { httpClient } from '../http-client';
import { Modal } from '@centrifuge/axis-modal';
import { Document } from '../common/models/document';
import { getAddressLink, getNFTLink } from '../common/etherscan';
import { Section } from '../components/Section';
import { Button, DataTable, Paragraph } from 'grommet';
import { DisplayField } from '@centrifuge/axis-display-field';
import { Money } from 'grommet-icons';
import { Registry } from '../common/models/schema';
import MintNftForm, { MintNftFormData } from './MintNftForm';
import { NOTIFICATION, NotificationContext } from '../components/notifications/NotificationContext';
import { AxiosError } from 'axios';
import { AppContext } from '../App';

type Props = {
  onCreateStart: (message: string) => void;
  onCreateComplete: (data) => void;
  onCreateError: (error) => void;
  document: Document,
  registries: Registry[],
  viewMode: boolean,
}

type State = {
  modalOpened: boolean
}

export const Nfts: FunctionComponent<Props> = (props) => {

  const [{
    modalOpened,
  }, setState] = useMergeState<State>({
    modalOpened: false,
  });


  const {
    onCreateStart,
    onCreateComplete,
    onCreateError,
    document,
    registries,
    viewMode,
  } = props;


  const { user } = useContext(AppContext);
  const notification = useContext(NotificationContext);


  const mintNFT = async (id: string | undefined, data: MintNftFormData) => {

    onCreateStart('Minting NFT');

    try {
      onCreateComplete((await httpClient.documents.mint(
        id,
        {
          deposit_address: data.transfer ? data.deposit_address : user!.account,
          proof_fields: data.registry!.proofs,
          registry_address: data.registry!.address,
        },
      )).data);


    } catch (e) {
      notification.alert({
        type: NOTIFICATION.ERROR,
        title: 'Failed to mint NFT',
        message: (e as AxiosError)!.response!.data.message,
      });

      onCreateError(e);
    }
  };

  const openModal = () => {
    setState({ modalOpened: true });
  };

  const closeModal = () => {
    setState({ modalOpened: false });
  };


  const mintActions = !viewMode ? [
    <Button key="mint-nft" onClick={openModal} icon={<Money/>} plain label={'Mint NFT'}/>,
  ] : [];

  const renderNftSection = () => {
    return (<Section
      title="NFTs"
      actions={mintActions}
    >

      <DataTable
        size={'100%'}
        sortable={false}
        data={document!.header!.nfts || []}
        primaryKey={'token_id'}
        columns={[
          {
            property: 'token_id',
            header: 'Token id',
            render: datum => <DisplayField
              link={{
                href: getNFTLink(datum.token_id, datum.registry),
                target: '_blank',
              }}
              value={datum.token_id}/>,
          },

          {
            property: 'registry',
            header: 'Registry',
            render: datum => <DisplayField
              link={{
                href: getAddressLink(datum.registry),
                target: '_blank',
              }}
              value={datum.registry}/>,
          },

          {
            property: 'owner',
            header: 'Owner',
            render: datum => <DisplayField
              link={{
                href: getAddressLink(datum.owner),
                target: '_blank',
              }}
              value={datum.owner}/>,

          },
        ]}
      />

      {!document!.header!.nfts &&
      <Paragraph color={'dark-2'}>There are no NFTs minted on this document yet.</Paragraph>}
    </Section>);
  };

  return <>
    <Modal
      width={'large'}
      opened={modalOpened}
      headingProps={{ level: 3 }}
      title={`Mint NFT`}
      onClose={closeModal}
    >
      <MintNftForm
        onSubmit={(data) => mintNFT(document!._id!, data)}
        onDiscard={closeModal}
        registries={registries}
      />
    </Modal>

    {renderNftSection()}

  </>;
};
