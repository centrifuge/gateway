import { httpRequestReducer } from '../http-request-reducer';
import { Contact } from '../../common/models/dto/contact';
import { getContactsActionTypes } from '../../actions/contacts';

export default httpRequestReducer<Contact[]>(getContactsActionTypes);
