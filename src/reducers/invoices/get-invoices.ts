import { ACTION_TYPES } from '../../actions/invoices/get-invoices';
import { Invoice } from '../../common/models/dto/invoice';
import { requestReducer } from '../requestReducer';

export default requestReducer<Invoice[]>(ACTION_TYPES);
