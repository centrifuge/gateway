import React from 'react';

import { connect } from 'react-redux';

import CreateEditPurchaseOrder from '../CreateEditPurchaseOrder';
import { RouteComponentProps, withRouter } from 'react-router';
import { RequestState } from '../../reducers/http-request-reducer';
import {
  PurchaseorderPurchaseOrderData,
  PurchaseorderPurchaseOrderResponse,
} from '../../../clients/centrifuge-node/generated-client';
import { Contact } from '../../common/models/dto/contact';
import { getContacts } from '../../actions/contacts';
import { LabelValuePair } from '../../interfaces';
import {
  createPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from '../../actions/purchase-orders';
import { PurchaseOrder } from '../../common/models/dto/purchase-order';

type ConnectedCreatePurchaseOrderProps = {
  updatePurchaseOrder: (purchaseOrder: PurchaseOrder) => void;
  purchaseOrder?: PurchaseOrder;
  getPurchaseOrderById: (id: string) => void;
  purchaseOrderId: string;
  getContacts: () => void;
  purchaseOrderLoading: boolean;
  contactsLoading: boolean;
  contacts?: LabelValuePair[];
} & RouteComponentProps<{ id?: string }>;

class ConnectedCreatePurchaseOrder extends React.Component<
  ConnectedCreatePurchaseOrderProps
> {
  componentDidMount() {
    if (!this.props.contacts) {
      this.props.getContacts();
    }

    if (this.props.match.params.id) {
      this.props.getPurchaseOrderById(this.props.match.params.id);
    }
  }

  updatePurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    this.props.updatePurchaseOrder(purchaseOrder);
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  render() {
    if (this.props.purchaseOrderLoading) {
      return 'Loading purchase order';
    }

    if (this.props.contactsLoading || !this.props.contacts) {
      return 'Loading';
    }

    return (
      <CreateEditPurchaseOrder
        onSubmit={this.updatePurchaseOrder}
        onCancel={this.onCancel}
        contacts={this.props.contacts}
        purchaseOrder={this.props.purchaseOrder}
      />
    );
  }
}

export default connect(
  (state: {
    purchaseOrders: {
      getById: RequestState<
        PurchaseorderPurchaseOrderResponse & { _id: string }
      >;
    };
    contacts: { get: RequestState<Contact[]> };
  }) => {
    return {
      purchaseOrderLoading: state.purchaseOrders.getById.loading,
      purchaseOrder: state.purchaseOrders.getById.data && {
        _id: state.purchaseOrders.getById.data._id,
        ...state.purchaseOrders.getById.data.data,
      },
      contactsLoading: state.contacts.get.loading,
      contacts: state.contacts.get.data
        ? (state.contacts.get.data.map(contact => ({
            label: contact.name,
            value: contact.address,
          })) as LabelValuePair[])
        : undefined,
    };
  },
  {
    createPurchaseOrder,
    getContacts,
    updatePurchaseOrder,
    getPurchaseOrderById,
  },
)(withRouter(ConnectedCreatePurchaseOrder));
