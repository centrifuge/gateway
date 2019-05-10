import React, {Component, ComponentClass} from 'react';
import { Box } from 'grommet';
import { AxisTheme } from '@centrifuge/axis-theme';

import Routing from './Routing';
import Header from './Header';
import { connect } from 'react-redux';
import { User } from './common/models/user';
import { push, RouterAction } from 'connected-react-router';
import {PERMISSIONS} from "./common/constants";
import invoicesRoutes from "./invoices/routes";
import contactsRoutes from "./contacts/routes";
import agreementsRoutes from "./agreements/routes";
import userRoutes from "./user/routes";
import routes from "./routes";
import InvoiceList from "./invoices/InvoiceList";
import UsersList from "./admin/users/UsersList";
import CreateInvoice from "./invoices/Create";
import {ConnectedInvoiceDetails} from "./invoices/InvoiceDetails";
import EditInvoice from "./invoices/Edit";
import Contacts from "./contacts/View";
import FundingAgreementsList from "./agreements/FundingAgreementsList";

interface AppPros {
  selectedRoute: string;
  loggedInUser: User | null;
  push: (route) => RouterAction
}

interface MenuItem {
  label: string,
  route: string,
  external?: boolean
}

interface RouteItem {
  path: string,
  component: any
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

    if (loggedInUser) {

      if (loggedInUser.permissions.includes(PERMISSIONS.CAN_MANAGE_USERS)) {
        menuItems.push(
            {label: 'Users', route: userRoutes.index},
        )
        routeItems.push(
            {
              path: routes.user.index,
              component: UsersList,
            },
        )
      }

      if(loggedInUser.permissions.includes(PERMISSIONS.CAN_CREATE_INVOICES)) {
        menuItems.push(...[
          { label: 'Invoices', route: invoicesRoutes.index },
          { label: 'Contacts', route: contactsRoutes.index }
        ])

        routeItems.push(
          {
            path: routes.invoices.index,
            component: InvoiceList,
          },
          {
            path: routes.invoices.new,
            component: CreateInvoice,
          },
          {
            path: routes.invoices.view,
            component: ConnectedInvoiceDetails,
          },
          {
            path: routes.invoices.edit,
            component: EditInvoice,
          },
          {
            path: routes.contacts.index,
            component: Contacts,
          }
        )
      }

      if(loggedInUser.permissions.includes(PERMISSIONS.CAN_FUND_INVOICES)) {
        menuItems.push(...[
          { label: 'Funding Agreements', route: agreementsRoutes.index },
        ])
        routeItems.push(
            {
              path: routes.agreements.index,
              component: FundingAgreementsList,
            }
        )
      }

      menuItems.push({ label: 'Logout', route: userRoutes.logout, external: true })

    }

    return (
      <div className="App">
        <AxisTheme>
          <Box fill align="center">
            <Header
              selectedRoute={selectedRoute}
              menuItems={menuItems}
              push={push}
            />
            <Box
              justify="center"
              direction="row"
              fill
              border="top"
            >
              <Box width="xlarge">
                <Routing routes={routeItems}/>
              </Box>
            </Box>

          </Box>
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
