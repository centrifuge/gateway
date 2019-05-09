import React from 'react';
import { Link } from 'react-router-dom';
import {Box, Button, FormField, TextInput, Layer, RadioButton} from 'grommet';
import { User } from '../common/models/user';
import * as Yup from 'yup'
import { Formik } from 'formik';
import {RequestState} from "../store/reducers/http-request-reducer";
import {connect} from "react-redux";
import {register} from "../store/actions/users";
import {RouteComponentProps, withRouter} from "react-router";
import {PERMISSIONS} from "../common/constants";

type RegisterProps = {
  register: (user) => void;
  // onSubmit: (values: any) => void;
  reveal: () => void;
} & RouteComponentProps;

class RegisterForm extends React.Component<RegisterProps> {

  state = {
    selected: 'Funder',
  }

  onSubmit = (user: User) => {

    user.date_added = new Date()
    this.props.register(user);
    this.revealForm()
  };

  revealForm = () => {
    this.props.reveal()
  }

  render() {

    const newUserValidation = Yup.object().shape({
      username: Yup.string()
          .max(40, 'Please enter no more than 40 characters')
          .required( 'This field is required'),
      password: Yup.string()
          .required('This field is required'),
      email: Yup.string()
          .email('Please enter a valid email')
          .required('This field is required')
    });

    const user = new User();
    const { selected } = this.state

    return (
        <Layer onEsc={this.revealForm} onClickOutside={this.revealForm}>
          <Box align="center" justify="center">
        <Box
          width="medium"
          background="white"
          margin="medium"
          pad="medium"
        >
          <Formik
            initialValues={user}
            validationSchema={newUserValidation}
            onSubmit={(values) => {
              this.onSubmit(values)
            }}
          >
            {
              ({
                 values,
                 errors,
                 handleChange,
                 handleSubmit,
               }) => (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                >

                  <Box gap="small">

                    <FormField
                      label="Username"
                      error={errors.username}
                    >
                      <TextInput
                        name="username"
                        value={values.username || ''}
                        onChange={handleChange}
                      />
                    </FormField>


                    <FormField
                      label="Password"
                      error={errors.password}
                    >
                      <TextInput
                        type="password"
                        name="password"
                        value={values.password || ''}
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

                    <Box direction={'row'} margin={{vertical: 'medium'}}>
                      {['Funder', 'Supplier', 'Admin'].map(label => {

                       return (
                          <Box key={label} margin={{ horizontal: 'small' }}>
                            <RadioButton
                                name='button'
                                checked={selected === label}
                                label={label}
                                onChange={() => {
                                  this.setState({selected: label})
                                  switch (label) {
                                    case 'Funder': {
                                      return values.permissions = [PERMISSIONS.CAN_FUND_INVOICES]
                                    }
                                    case 'Supplier': {
                                      return values.permissions = [PERMISSIONS.CAN_CREATE_INVOICES]
                                    }
                                    case 'Admin': {
                                      return values.permissions = [PERMISSIONS.CAN_MANAGE_USERS]
                                    }
                                  }
                                }}
                            />
                          </Box>
                      )}
                      )}
                    </Box>

                    <Box direction="row" height="50px" justify={'between'}>
                      <Button
                          label="Discard"
                          onClick={ this.revealForm}
                      />
                      <Button
                        type="submit"
                        primary
                        label="Register"
                      />
                    </Box>

                  </Box>
                </form>
              )
            }
          </Formik>
        </Box>
      </Box>
        </Layer>
    );
  }
}

const mapStateToProps = (state: { user: { register: RequestState<User> } }) => {
  return {
    isRegistering: state.user.register.loading,
    hasRegistered: !!state.user.register.data,
  };
}

export default connect(
    mapStateToProps,
    { register },
)(withRouter(RegisterForm))
