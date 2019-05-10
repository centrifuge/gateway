import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, DataTable, Heading, Text } from 'grommet';
import { RouteComponentProps, withRouter } from 'react-router';

type FundingAgreementsListProps = {
  loading: boolean;
};

class FundingAgreementsList extends React.Component<FundingAgreementsListProps & RouteComponentProps> {
  displayName = 'FundingAgreementsList';
  state = {
    show: false,
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // onSubmit = (values: Invoice) => {
  //   return this.props.onSubmit && this.props.onSubmit({ ...values });
  // };

  renderAgreements = (data) => {
    return (
        <Box>
          <DataTable
              data={data}
              sortable={true}
              columns={[
                {
                  property: 'borrower',
                  header: 'Borrower',
                  render: data =>
                      data.borrower ? <Text>{data.borrower}</Text> : null,
                },
                {
                  property: 'funding_id',
                  header: 'Funding Agreement ID',
                  render: data =>
                      data.funding_id ? <Text>{data.funding_id}</Text> : null,
                },
                {
                  property: 'invoice_number',
                  header: 'Invoice Number',
                  render: data =>
                      data.invoice_number ? <Text>{data.invoice_number}</Text> : null,
                },
                {
                  property: 'invoice_total',
                  header: 'Invoice Total',
                  render: data =>
                      data.invoice_total ? <Text>{data.invoice_total}</Text> : null,
                },
                {
                  property: 'amount',
                  header: 'Funded Amount',
                  render: data =>
                      data.amount ? <Text>{data.amount}</Text> : null,
                },
                {
                  property: 'repayment_due_date',
                  header: 'Repayment Due Date',
                  render: data =>
                      data.repayment_due_date ? <Text>{data.repayment_due_date}</Text> : null,
                },
                {
                  property: 'status',
                  header: 'Status',
                  render: data =>
                      data.status ? <Text>{data.status}</Text> : null,
                },
                {
                  property: 'action',
                  header: 'Action',
                  render: data =>
                      data.action ? <Text>{data.action}</Text> : null,
                },
              ]}
          />
        </Box>
    )
  }

  renderForm = () => {
  }

  render() {
    // if (this.props.loading || !this.props.agreements) {
    //   return 'Loading';
    // }

    const data = [
      {
        funding_id: 1111,
        invoice_number: 2222,
        invoice_total: 5555,
        borrower: 'asterix',
        amount: 13371,
        repayment_due_date: 'Whenever',
        status: 'active',
      },
      {
        funding_id: 1111,
        invoice_number: 2222,
        invoice_total: 5555,
        borrower: 'asterix',
        amount: 13371,
        repayment_due_date: 'Whenever',
        status: 'active',
      }
    ]

    return  (
        <Box fill>
          <Box justify="between" direction="row" align="center">
            <Heading level="3">Funding Agreements</Heading>
          </Box>
          { this.renderAgreements(data) }
        </Box>
    );
  }
}

export default connect()(withRouter(FundingAgreementsList));