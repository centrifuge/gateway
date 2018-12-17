import React, { FunctionComponent } from 'react';
import { Box } from 'grommet';
import { Route, Switch } from 'react-router';
import routes from '../routes';
import Invoices from '../invoices/view';
import CreateInvoice from '../invoices/create';
import PurchaseOrders from '../purchaseorders/PurchaseOrders';
import Contacts from '../contacts/view';
import LoginPage from '../user/login';
import CreateContact from '../contacts/create';

const Body: FunctionComponent = () => (
  <Box
    justify="center"
    direction="row"
    fill="true"
    background="bodyBackground"
    border="top"
  >
    <Box width="xlarge">
      <Switch>
        <Route path={routes.invoices.new} component={CreateInvoice} />
        <Route path={routes.invoices.index} component={Invoices} />
        <Route path={routes.purchaseOrders.index} component={PurchaseOrders} />
        <Route path={routes.contacts.new} component={CreateContact} />
        <Route path={routes.contacts.index} component={Contacts} />
        <Route path={routes.index} component={LoginPage} />
      </Switch>
    </Box>
  </Box>
);

Body.displayName = 'Body';

export default Body;
