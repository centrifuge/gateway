import React from 'react';

import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Text } from 'grommet';

import { logout } from '../../actions/users';
import routes from '../../routes';
import { LoginState } from '../../reducers/user/auth';

type ConnectedLoginPageProps = {
  logout: () => void;
  loading: boolean;
  loggedIn: boolean;
} & RouteComponentProps;

class ConnectedLoginPage extends React.Component<ConnectedLoginPageProps> {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return this.props.loggedIn || this.props.loading ? (
      <Text>Loading</Text>
    ) : (
      <Redirect to={routes.index} />
    );
  }
}

const mapStateToProps = (state: { user: { auth: LoginState } }) => {
  return {
    loading: state.user.auth.loading,
    loggedIn: state.user.auth.loggedIn,
  };
};

export default connect(
  mapStateToProps,
  { logout },
)(withRouter(ConnectedLoginPage));
