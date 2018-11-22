import { ACTION_TYPES } from '../../actions/invoices/create-invoice';
import { requestReducer } from '../requestReducer';
import { Invoice } from '../../common/models/dto/invoice';

export default requestReducer<Invoice>(ACTION_TYPES);
