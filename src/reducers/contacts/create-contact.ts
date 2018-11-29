import { httpRequestReducer } from '../http-request-reducer';
import { createContactActionTypes } from '../../actions/contacts';
import { Contact } from '../../common/models/dto/contact';

export default httpRequestReducer<Contact>(createContactActionTypes);
