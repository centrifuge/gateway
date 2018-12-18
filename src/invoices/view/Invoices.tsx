import React from 'react';
import { Box, DataTable, Heading, Text, Button } from 'grommet';
import { Add, Edit, More } from 'grommet-icons';
import { Link } from 'react-router-dom';

import invoiceRoutes from '../routes';
import { InvoiceInvoiceData } from '../../../clients/centrifuge-node/generated-client';
import { GetInvoicesInterface } from '../../reducers/invoices/get-invoices';
import { Contact } from '../../common/models/dto/contact';

interface InvoiceTableColumn {
  property:
    | keyof GetInvoicesInterface
    | keyof [keyof { supplier: Contact }]
    | '_id';
  header: string;
  render?: (datum: GetInvoicesInterface) => JSX.Element;
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
    /// @ts-ignore
    property: 'supplier',
    header: 'Supplier',
    render: data => <Text>{data.supplier.name}</Text>,
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
      <Box fill>
        <Box justify="between" direction="row" align="center">
          <Heading level="3">Invoices</Heading>
          <Link to={invoiceRoutes.new}>
            <Button
              icon={<Add color="white" size="12px" />}
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
