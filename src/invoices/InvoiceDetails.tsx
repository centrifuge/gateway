import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'grommet';
import { InvoiceData, LabelValuePair } from '../common/interfaces';
import { FunFundingResponseData } from '../../clients/centrifuge-node';
import { DisplayField } from '../components/DisplayField';
import { Sender } from './invoice-details-partials/Sender';
import { Recipient } from './invoice-details-partials/Recipient';
import { ShipTo } from './invoice-details-partials/ShipTo';
import { RemitTo } from './invoice-details-partials/RemitTo';
import { Details } from './invoice-details-partials/Details';
import { CreditNote } from './invoice-details-partials/CreditNote';
import { Section } from '../components/Section';
import { InvoiceTotal } from './invoice-details-partials/InvoiceTotal';
import { Modal } from '@centrifuge/axis-modal';
import { FundingAgreement } from './invoice-details-partials/FundingAgreement';

type ConnectedInvoiceDetailsProps = {
  invoice: InvoiceData;
  fundingAgreement: FunFundingResponseData | null,
  contacts: LabelValuePair[];
}

export class InvoiceDetails extends React.Component<ConnectedInvoiceDetailsProps> {

  displayName = 'InvoiceDetails';

  render() {
    const { invoice, contacts, fundingAgreement } = this.props;
    const columnGap = 'medium';
    const sectionGap = 'medium';

    return (
      <Box>
        <Box direction="column" gap={sectionGap}>
          <Box>
            {/* Invoice number section */}
            <Box>
              <DisplayField
                label="Invoice number"
                value={invoice!.number}
              />
            </Box>
          </Box>

          {/*Funding Agreement*/}

          {fundingAgreement && <FundingAgreement fundingAgreement={fundingAgreement} columnGap={columnGap}/>}

          {/*Sender and Recipient */}
          <Box direction="row" gap={columnGap}>
            <Sender
              invoice={invoice}
              columnGap={columnGap}
              contacts={contacts}
            />
            <Recipient
              invoice={invoice}
              columnGap={columnGap}
              contacts={contacts}
            />
          </Box>


          {/* Details section */}
          <Box gap={columnGap}>
            <Details
              invoice={invoice}
              columnGap={columnGap}
            />
          </Box>

          {/* Invoice total section */}
          <Box gap={columnGap}>
            <InvoiceTotal
              invoice={invoice}
              columnGap={columnGap}
            />
          </Box>

          {/*Ship to and Remit to */}
          <Box direction="row" gap={columnGap}>
            <ShipTo
              invoice={invoice}
              columnGap={columnGap}
            />
            <RemitTo
              invoice={invoice}
              columnGap={columnGap}
            />
          </Box>

          {/* Credit note section */}
          <Box direction="row" gap={columnGap}>
            <CreditNote
              invoice={invoice}
              columnGap={columnGap}
            />
          </Box>

          {/* Comments section */}
          <Box direction="row">
            <Section headingLevel="5" title="Comments" basis={'1/2'}>
              <DisplayField
                value={invoice!.comment}
              />
            </Section>

          </Box>
        </Box>
      </Box>
    );

  }
}
