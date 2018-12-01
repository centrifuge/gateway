import React from 'react';
import { Box, DataTable, Heading } from 'grommet';
import { Add, Edit, More } from 'grommet-icons';
import { Link } from 'react-router-dom';

import invoiceRoutes from '../routes';
import { InvoiceInvoiceData } from '../../../clients/centrifuge-node/generated-client';
import { nameOfFactory } from '../../util';

const nameOf = nameOfFactory<InvoiceInvoiceData>();

// Casting to "any" until https://github.com/grommet/grommet/issues/2464 is fixed
const DataTableSupressedWarning = DataTable as any;

const columns = [
  {
    property: nameOf("invoice_number"),
    header: 'Number',
  },
  {
    property: nameOf('recipient_name'),
    header: 'Customer',
  },
  {
    property: nameOf('sender_name'),
    header: 'Supplier',
  },
  {
    property: nameOf('invoice_status'),
    header: 'Status',
  },
  {
    property: 'actions',
    header: 'Actions',
    render: () => (
      <Box direction="row" gap="small">
        <Edit />
        <More />
      </Box>
    ),
  },
];

type InvoicesProps = { invoices: InvoiceInvoiceData[] };

export default class Invoices extends React.Component<InvoicesProps> {
  displayName = 'Invoices';

  render() {
    return (
      <Box fill="true">
        <Box justify="between" direction="row" align="center">
          <Heading level="3">Invoices</Heading>
          <Link to={invoiceRoutes.new}>
            <Box justify="center" align="center" direction="row">
              <Add />
              Add new
            </Box>
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
