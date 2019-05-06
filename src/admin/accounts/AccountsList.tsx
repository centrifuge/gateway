import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getAllAccounts,
  resetGetAllAccounts,
  generateAccount,
  resetGenerateAccount,
} from '../../store/actions/admin';
import { RequestState } from '../../store/reducers/http-request-reducer';
import {Box, Button, DataTable, Heading, Text, Layer, FormField, TextInput } from 'grommet';
import { RouteComponentProps, withRouter } from 'react-router';
import {AccountAccountData, AccountGetAllAccountResponse} from '../../../clients/centrifuge-node';
import { Formik, Form } from 'formik';
import * as Yup from 'yup'

type AccountsListProps = {
  getAllAccounts: () => void;
  resetGetAllAccounts: () => void;
  resetGenerateAccount: () => void;
  generateAccount: () => void;
  accounts?: AccountGetAllAccountResponse[];
  loading: boolean;
};

class AccountsList extends React.Component<AccountsListProps & RouteComponentProps> {
  displayName = 'AccountsList';
  state = {
    show: false,
  }

  componentDidMount() {
    this.props.getAllAccounts();
  }

  componentWillUnmount() {
    this.props.resetGetAllAccounts();
    this.props.resetGenerateAccount();
  }

  // onSubmit = (values: Invoice) => {
  //   return this.props.onSubmit && this.props.onSubmit({ ...values });
  // };

  generateNewAccount = () => {
    this.props.generateAccount()
  }

  renderAccounts = (data) => {
    return (
        <Box>
          <DataTable
              data={data}
              columns={[
                {
                  property: 'centrifuge_id',
                  header: 'Centrifuge ID',
                  render: data =>
                      data.identity_id ? <Text>{data.identity_id}</Text> : null,
                },
              ]}
          />
        </Box>
    )
  }

  renderForm = () => {

    const newAccountValidation = Yup.object().shape({
      name: Yup.string()
          .max(40, 'Please enter no more than 40 characters')
          .required( 'This field is required'),
      email: Yup.string()
          .email('Please enter a valid email')
          .required('This field is required')
    });

    return (
        <Layer onEsc={() => this.setState({show: false})} onClickOutside={() => this.setState({show: false})}>
          <Formik
              initialValues={{ name: '', email: '' }}
              validationSchema={newAccountValidation}
              onSubmit={(values, { setSubmitting }) => {
                // if (!values) return;
                // this.onSubmit(values);
                // setSubmitting(true);
              }}
          >
            {({ values,errors,handleChange, handleSubmit }) => (
                <Box direction='column'>
                  <Heading margin='medium' level='5'>Add Account</Heading>
                  <Form>
                    <Box fill pad='medium' gap="medium">

                      <FormField
                          label="Name"
                          error={errors!.name}
                      >
                        <TextInput
                            name="name"
                            value={values!.name}
                            onChange={handleChange}
                        />
                      </FormField>

                      <FormField
                          label="Email"
                          error={errors!.email}
                      >
                        <TextInput
                            name="email"
                            value={values!.email}
                            onChange={handleChange}
                        />
                      </FormField>
                      <Box direction="row" gap="large" pad="large">
                        <Button label="Discard" onClick={() => this.setState({show: false})} />
                        <Button type="submit" primary label="Save" onClick={() => {
                          this.generateNewAccount()
                          this.setState({show: false})
                        }}
                        />
                      </Box>
                    </Box>
                  </Form>
                </Box>
            )}
          </Formik>
        </Layer>
    )
  }

  render() {
  if (this.props.loading || !this.props.accounts) {
  return 'Loading';
  }

    return  (
        <Box fill>
          <Box justify="between" direction="row" align="center">
            <Heading level="3">Account Management</Heading>
              <Box>
                <Button primary label="Add New Account" onClick={
                  () => {
                    this.setState({show: true})
                  }
                } />
              </Box>
            { this.state.show && this.renderForm() }
          </Box>
          { this.renderAccounts(this.props.accounts) }
        </Box>
    );
  }
}

export default connect(
    (state: {
      admin: {
        getAccounts: RequestState<AccountGetAllAccountResponse[]>;
        generateNewAccount: RequestState<AccountAccountData>;
      };
    }) => {
      return {
        accounts: state.admin.getAccounts.data,
        show: false
      };
    },
    {
      getAllAccounts, resetGetAllAccounts, generateAccount, resetGenerateAccount
    },
)(withRouter(AccountsList));
