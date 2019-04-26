import invoiceRoutes from './invoices/routes';
import contactsRoutes from './contacts/routes';
import userRoutes from './user/routes';
import adminRoutes from './admin/routes';

export default {
  admin: adminRoutes,
  invoices: invoiceRoutes,
  contacts: contactsRoutes,
  user: userRoutes,
  index: '/'
}
