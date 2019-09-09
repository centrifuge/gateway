import contactsRoutes from './contacts/routes';
import { schemasRoutes } from './admin/schemas/routes';
import { documentRoutes } from './documents/routes';
import userRoutes from './user/routes';

export default {
  documents: documentRoutes,
  contacts: contactsRoutes,
  user: userRoutes,
  schemas: schemasRoutes,
  index: '/'
}
