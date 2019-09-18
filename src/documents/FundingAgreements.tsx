import React, { FunctionComponent, useContext } from 'react';
import { useMergeState } from '../hooks';
import { httpClient } from '../http-client';
import { Contact } from '../common/models/contact';
import FundingRequestForm from './FundingAgreementForm';
import { Modal } from '@centrifuge/axis-modal';
import { Document } from '../common/models/document';
import { getAddressLink } from '../common/etherscan';
import { extractDate } from '../common/formaters';
import { Section } from '../components/Section';
import { Anchor, Box, Button, DataTable, Paragraph } from 'grommet';
import { DisplayField } from '@centrifuge/axis-display-field';
import { Money } from 'grommet-icons';
import { NOTIFICATION, NotificationContext } from '../components/notifications/NotificationContext';
import { AxiosError } from 'axios';
import { canSignFunding } from '../common/models/user';
import { AppContext } from '../App';
import { Status } from '../components/Status';
import { getFundingStatus } from '../common/status';

type Props = {
  onCreateStart: (message: string) => void;
  onCreateComplete: (data) => void;
  onCreateError: (error) => void;
  document: Document,
  contacts: Contact[],
  viewMode: boolean,
}

type State = {
  modalOpened: boolean
}

export const FundingAgreements: FunctionComponent<Props> = (props) => {

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
    contacts,
    viewMode,
  } = props;

  const notification = useContext(NotificationContext);
  const { user } = useContext(AppContext);

  const createFundingAgreement = async (document_id, data) => {
    setState({
      modalOpened: false,
    });

    onCreateStart('Creating Funding Agreement');
    try {
      const payload = {
        ...data,
        document_id,
      };
      onCreateComplete((await httpClient.funding.create(payload)).data);

    } catch (e) {
      notification.alert({
        type: NOTIFICATION.ERROR,
        title: ' Failed to create funding agreement',
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


  const fundingActions = !viewMode ? [
    <Button key="create-funding-agreement" onClick={openModal} icon={<Money/>} plain label={'Request funding'}/>,
  ] : [];

  const renderFundingSection = () => {


    const mappedToSortable = (document!.attributes!.funding_agreement || []).map(fundingAgreement => {
      return {
        agreement_id: fundingAgreement.agreement_id.value,
        amount: fundingAgreement.amount.value,
        repayment_amount: fundingAgreement.repayment_amount.value,
        repayment_due_date: fundingAgreement.repayment_due_date.value,
        funder_id: fundingAgreement.funder_id.value,
        fee: fundingAgreement.fee.value,
      };
    });

    const columns = [
      {
        property: 'agreement_id',
        header: 'Agreement Id',
        render: datum => <DisplayField
          value={datum.agreement_id}/>,

      },
      {
        property: 'funder_id',
        header: 'Funder Id',
        render: datum => <DisplayField
          link={{
            href: getAddressLink(datum.funder_id),
            target: '_blank',
          }}
          value={datum.funder_id}/>,
      },
      {
        property: 'amount',
        header: 'Amount',
      },
      {
        property: 'repayment_amount',
        header: 'Repayment Amount',
      },
      {
        property: 'repayment_due_date',
        header: 'Repayment Due Date',
        render: (datum => extractDate(datum.repayment_due_date)),
      },

      {
        property: 'status',
        header: 'Status',
        render: (datum => <Status value={getFundingStatus(datum)}/>),
      },
      {
        property: '_id',
        header: 'Actions',
        sortable: false,
        render: datum => (
          <Box direction="row" gap="small">
            {canSignFunding(user, document) &&
            <Anchor
              label={'Sign'}
              onClick={() =>
                alert('sign')
              }
            />
            }

          </Box>
        ),
      },
    ];

    return (<Section
      title="Funding Agreements"
      actions={fundingActions}
    >

      <DataTable
        size={'100%'}
        sortable={false}
        data={mappedToSortable}
        primaryKey={'token_id'}
        columns={columns}
      />

      {!mappedToSortable.length &&
      <Paragraph color={'dark-2'}>There are no funding agreements yet.</Paragraph>}
    </Section>);
  };

  return <>
    <Modal
      width={'large'}
      opened={modalOpened}
      headingProps={{ level: 3 }}
      title={`Request Funding`}
      onClose={closeModal}
    >
      <FundingRequestForm
        today={new Date()}
        onSubmit={(data) => {
          createFundingAgreement(document!.header!.document_id!, data);
        }}
        contacts={contacts}
        onDiscard={closeModal}
      />
    </Modal>

    {renderFundingSection()}

  </>;
};
