import React, { Component } from 'react';
import { Anchor, Box, Image, Text } from 'grommet';
import { AxisTheme } from '@centrifuge/axis-theme';
import Routing, { RouteItem } from './Routing';
import { MenuItem, NavBar } from '@centrifuge/axis-nav-bar';
import { connect } from 'react-redux';
import { User } from './common/models/user';
import { push, RouterAction } from 'connected-react-router';
import { PERMISSIONS } from './common/constants';
import routes from './routes';

import UsersList from './admin/users/UsersList';


import Contacts from './contacts/View';
import { NotificationProvider } from './notifications/NotificationContext';
import { ConnectedNotifications } from './notifications/Notifications';
import SchemasList from './admin/schemas/SchemasList';
import ListDocuments from './documents/ListDocuments';
import CreateDocument from './documents/CreateDocument';
import ViewDocument from './documents/ViewDocument';
import EditDocument from './documents/EditDocument';
import { getAddressLink } from './common/etherscan';
import { DisplayField } from '@centrifuge/axis-display-field';
import logo from './logo.png';

interface AppPros {
  selectedRoute: string;
  loggedInUser: User | null;
  push: (route) => RouterAction
}


class App extends Component<AppPros> {
  render() {

    const {
      selectedRoute,
      loggedInUser,
      push,
    } = this.props;

    let menuItems: MenuItem[] = [];
    let routeItems: RouteItem[] = [];


    //TODO move this a function that generates menuItems and routes items based on a user
    if (loggedInUser) {

      // There are no special permission for contacts
      menuItems.push({ label: 'Contacts', route: routes.contacts.index });
      routeItems.push(
        {
          path: routes.contacts.index,
          component: Contacts,
        },
      );

      if (loggedInUser.permissions.includes(PERMISSIONS.CAN_MANAGE_SCHEMAS)) {
        menuItems.push(
          { label: 'Schemas', route: routes.schemas.index },
        );
        routeItems.push(
          {
            path: routes.schemas.index,
            component: SchemasList,
          },
        );
      }

      if (loggedInUser.permissions.includes(PERMISSIONS.CAN_MANAGE_USERS)) {
        menuItems.push(
          { label: 'Users', route: routes.user.index },
        );
        routeItems.push(
          {
            path: routes.user.index,
            component: UsersList,
          },
        );
      }



      if (loggedInUser.permissions.includes(PERMISSIONS.CAN_VIEW_DOCUMENTS) || loggedInUser.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS)) {
        menuItems.push({ label: 'Documents', route: routes.documents.index });

        // The order is important and the path are similar and routes will match first route it finds
        // documents/new can match documents/{id} if the routes is declared after
        if (loggedInUser.schemas.length) {
          routeItems.push(
            {
              path: routes.documents.new,
              component: CreateDocument,
            },
          );

        }

        routeItems.push(
          {
            path: routes.documents.index,
            component: ListDocuments,
          },
          {
            path: routes.documents.view,
            component: ViewDocument,
          },
          {
            path: routes.documents.edit,
            component: EditDocument,
          },
        );


      }

      menuItems.push({ label: 'Log out', route: routes.user.logout, external: true, secondary: true });

    }

    return (
      <div className="App">
        <AxisTheme full={true}>
          <NotificationProvider>
            <Box align="center">
              <ConnectedNotifications/>
              <NavBar
                width={'xxlarge'}
                logo={
                  <Anchor href="/">
                    <Image src={logo}/>
                  </Anchor>
                }
                selectedRoute={selectedRoute}
                menuLabel={loggedInUser ? loggedInUser.email : ''}
                menuItems={menuItems.reverse()}
                onRouteClick={(item) => {
                  if (item.external) {
                    window.location.replace(item.route);
                  } else {
                    push(item.route);
                  }
                }}
              >
                {loggedInUser && <Box direction="row" gap={'medium'} align={'center'} justify="end">
                  <Box direction="row" align="center" gap={'xsmall'}>
                    <Text>Centrifuge ID: </Text>
                    <Box width={'160px'}>
                      <DisplayField
                        link={{
                          href: getAddressLink(loggedInUser.account),
                          target: '_blank',
                        }}
                        value={loggedInUser.account}
                      />

                    </Box>
                  </Box>
                </Box>}
              </NavBar>
              <Box
                justify="center"
                direction="row"
              >
                <Box width="xxlarge">
                  <Routing routes={routeItems}/>
                </Box>
              </Box>

            </Box>
          </NotificationProvider>
        </AxisTheme>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedRoute: state.router.location.pathname,
    loggedInUser: state.user.auth.loggedInUser,
  };
};

export default connect(
  mapStateToProps,
  { push },
)(App);
