import React from 'react';
import {Anchor, Box, Button, Text, TextInput} from 'grommet';
import { Field, Form } from 'react-final-form';
import { User } from '../../common/models/dto/user';
import Link from "../../components/Link";

interface LoginProps {
  onSubmit: (values: any) => void;
}

class Login extends React.Component<LoginProps> {
  onSubmit = values => {
    this.props.onSubmit(values as User);
  };

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <Box align="center" justify="center">
            <Box
              width="medium"
              background="white"
              border="all"
              margin="medium"
              pad="medium"
            >
              <form onSubmit={handleSubmit}>
                <Box gap="small">
                  <Field name="username">
                    {({ input, meta }) => (
                      <Box fill>
                        <label>Username</label>
                        <TextInput
                          {...input}
                          placeholder="Please enter your username"
                        />
                        {meta.error && meta.touched && (
                          <span>{meta.error}</span>
                        )}
                      </Box>
                    )}
                  </Field>
                  <Field name="password">
                    {({ input, meta }) => (
                      <Box fill>
                        <label>Password</label>
                        <TextInput
                          {...input}
                          placeholder="Please enter your password"
                        />
                        {meta.error && meta.touched && (
                          <span>{meta.error}</span>
                        )}
                      </Box>
                    )}
                  </Field>
                  <Box direction="row" height="50px">
                    <Button type="submit" primary label="Register" fill={true} />
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      />
    );
  }
}

export default Login;
