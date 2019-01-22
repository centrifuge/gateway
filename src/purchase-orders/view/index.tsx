import React from 'react';

import { connect } from 'react-redux';

import PurchaseOrders from './PurchaseOrdersList';
import { RequestState } from '../../reducers/http-request-reducer';
import { PurchaseorderPurchaseOrderData } from '../../../clients/centrifuge-node/generated-client';
import { getPurchaseOrders } from '../../actions/purchase-orders';
import { PurchaseOrderResponse } from '../../interfaces';

const mapStateToProps = (state: {
  purchaseOrders: {
    get: RequestState<(PurchaseOrderResponse)[]>;
  };
}) => {
  return {
    purchaseOrders:
      state.purchaseOrders.get.data &&
      (state.purchaseOrders.get.data.map(
        response => response.data,
      ) as PurchaseorderPurchaseOrderData[]),
    loading: state.purchaseOrders.get.loading,
  };
};

type ViewInvoicesProps = {
  getPurchaseOrders: () => void;
  clearInvoices: () => void;
  purchaseOrders?: PurchaseorderPurchaseOrderData[];
  loading: boolean;
};

class ViewInvoices extends React.Component<ViewInvoicesProps> {
  componentDidMount() {
    this.props.getPurchaseOrders();
  }

  render() {
    if (this.props.loading || !this.props.purchaseOrders) {
      return 'Loading';
    }

    return <PurchaseOrders purchaseOrders={this.props.purchaseOrders} />;
  }
}

export default connect(
  mapStateToProps,
  { getPurchaseOrders },
)(ViewInvoices);
