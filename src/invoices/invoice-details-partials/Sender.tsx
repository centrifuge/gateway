import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'grommet';
import { Section } from '@centrifuge/axis-section';
import { LabelValuePair } from '../../common/interfaces';
import { Invoice } from '../../common/models/invoice';
import { DisplayField } from '../../components/DisplayField';


interface SenderProps {
  invoice: Invoice;
  contacts: LabelValuePair[];
  columnGap: string;
};


export class Sender extends React.Component<SenderProps> {
  displayName = 'Sender';

  render() {

    const {
      invoice,
      contacts,
      columnGap,
    } = this.props;

    const senderName = contacts.filter(contact =>
      contact.value === invoice!.sender,
    ).map(contact => contact.label).shift();

    return (
      <Box direction="row" gap={columnGap} basis={'1/2'}>
        <Box gap={columnGap} basis={'1/2'}>
          <DisplayField
            label="Centrifuge ID"
            value={senderName}
          />
          <DisplayField
            label="Company name"
            value={invoice!.sender_company_name}
          />
        </Box>
        <Box gap={columnGap} basis={'1/2'}>
          <DisplayField
            label="Street"
            value={invoice!.sender_street1}
          />
          <DisplayField
            label="Street"
            value={invoice!.sender_street2}
          />
          <DisplayField
            label="City"
            value={invoice!.sender_city}
          />
          <DisplayField
            label="Country"
            value={invoice!.sender_country}
          />
          <DisplayField
            label="ZIP code"
            value={invoice!.sender_zipcode}
          />
        </Box>
      </Box>
    );

  }
}


