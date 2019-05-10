import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, DataTable, Heading, Text } from 'grommet';
import { RouteComponentProps, withRouter } from 'react-router';

type FundingAgreementsListProps = {
  // getAllAccounts: () => void;
  // resetGetAllAccounts: () => void;
  // accounts?: AccountGetAllAccountResponse[];
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
              columns={[
                {
                  property: 'funding_agreement_number',
                  header: 'Funding Agreement Number',
                  render: data =>
                      data.funding_agreement_number ? <Text>{data.funding_agreement_number}</Text> : null,
                },
                {
                  property: 'invoice_number',
                  header: 'Invoice Number',
                  render: data =>
                      data.invoice_number ? <Text>{data.invoice_number}</Text> : null,
                },
                {
                  property: 'borrower',
                  header: 'Borrower',
                  render: data =>
                      data.borrower ? <Text>{data.borrower}</Text> : null,
                },
                {
                  property: 'finance_amount',
                  header: 'Finance Amount',
                  render: data =>
                      data.finance_amount ? <Text>{data.finance_amount}</Text> : null,
                },
                {
                  property: 'due_date',
                  header: 'Due Date',
                  render: data =>
                      data.due_date ? <Text>{data.due_date}</Text> : null,
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
        funding_agreement_number: 1111,
        invoice_number: 1111,
        borrower: 'asterix',
        finance_amount: 1337,
        due_date: 'Whenever',
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