import React, { ReactNode } from 'react';
import { Box, Button, DataTable, Heading, Text } from 'grommet';
import { Add, Edit, More } from 'grommet-icons';
import { Link } from 'react-router-dom';

import invoiceRoutes from '../routes';
import { Contact } from '../../common/models/dto/contact';
import { InvoiceData } from '../../interfaces';

interface InvoiceTableColumn {
  property: keyof InvoiceData | keyof [keyof { supplier: Contact }] | '_id';
  header: string;
  render?: (datum: InvoiceData) => ReactNode;
  format?: Function;
}

// Casting to "any" until https://github.com/grommet/grommet/issues/2464 is fixed
const DataTableSupressedWarning = DataTable as any;

const columns: InvoiceTableColumn[] = [
  {
    property: 'invoice_number',
    header: 'Number',
  },
  {
    property: 'recipient_name',
    header: 'Customer',
  },
  {
    property: 'supplier',
    header: 'Supplier',
    render: data => (data.supplier ? <Text>{data.supplier.name}</Text> : null),
  },
  {
    property: 'invoice_status',
    header: 'Status',
  },
  {
    property: '_id',
    header: 'Actions',
    render: () => (
      <Box direction="row" gap="small">
        <Edit />
      </Box>
    ),
  },
];

type InvoicesProps = { invoices: InvoiceData[] };

export default class Invoices extends React.Component<InvoicesProps> {
  displayName = 'Invoices';

  render() {
    return (
      <Box fill>
        <Box justify="between" direction="row" align="center">
          <Heading level="3">Invoices</Heading>
          <Link to={invoiceRoutes.new}>
            <Button
              icon={<Add color="white" size="small" />}
              primary
              label="Add new"
            />
          </Link>
        </Box>

        <Box>
          <DataTableSupressedWarning
            data={this.props.invoices}
            columns={columns}
          />
        </Box>
      </Box>
    );
  }
}
