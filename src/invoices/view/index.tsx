import React from 'react';

import { connect } from 'react-redux';

import Invoices from './Invoices';
import { getInvoices } from '../../actions/invoices/get-invoices';
import { Invoice } from '../../common/models/dto/invoice';

const mapDispatchToProps = dispatch => ({
  getInvoices: () => dispatch(getInvoices.invoke),
});

const mapStateToProps = state => {
  return {
    invoices: state.invoices.get.data,
  };
};

type ViewInvoicesProps = {
  getInvoices: () => void;
  clearInvoices: () => void;
  invoices: Invoice[];
};

class ViewInvoices extends React.Component<ViewInvoicesProps> {
  componentDidMount() {
    this.props.getInvoices();
  }

  render() {
    return <Invoices invoices={this.props.invoices} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewInvoices);
