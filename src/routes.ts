import invoiceRoutes from './invoices/routes';
import contactsRoutes from './contacts/routes';
import userRoutes from './user/routes';
import agreementsRoutes from './agreements/routes'

export default {
  agreements: agreementsRoutes,
  invoices: invoiceRoutes,
  contacts: contactsRoutes,
  user: userRoutes,
  index: '/'
}
