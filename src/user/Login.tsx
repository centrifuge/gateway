import React from 'react';
import { Box, Button, Heading, TextInput } from 'grommet';
import { Field, Form } from 'react-final-form';
import { httpClient } from '../http-client';
import { RouteComponentProps, withRouter } from 'react-router';
import routes from '../routes';

class Login extends React.Component<RouteComponentProps> {
  onSubmit = values => {
    httpClient.users.setCredentials(values.username, values.password);
    this.props.history.push(routes.invoices.index);
  };

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        initialValues={{ username: 'test', password: 'test' }}
        render={({ handleSubmit }) => (
          <Box fill="true">
            <form onSubmit={handleSubmit}>
              <Box justify="between" direction="row">
                <Heading level="2">username: test, password: test</Heading>
                <Heading level="3">Login</Heading>
              </Box>
              <Box>
                <Field name="username">
                  {({ input, meta }) => (
                    <Box fill="true">
                      <label>Username</label>
                      <TextInput
                        {...input}
                        placeholder="Please enter your username"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </Box>
                  )}
                </Field>
                <Field name="password">
                  {({ input, meta }) => (
                    <Box fill="true">
                      <label>Password</label>
                      <TextInput
                        {...input}
                        placeholder="Please enter your password"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </Box>
                  )}
                </Field>
                <Box direction="row" gap="small" justify="end">
                  <Button type="submit">Login</Button>
                </Box>
              </Box>
            </form>
          </Box>
        )}
      />
    );
  }
}

export default withRouter(Login);
