import { NotificationContext } from './NotificationContext';
import React from 'react';

export type NotificationsProps = {
  alert: any,
  closeAlert:  any,
}

// TODO delete this at some point
export class Notifications extends React.Component<NotificationsProps> {
  render() {

    const { alert, closeAlert } = this.props;
    const { notify } = this.context;
    setTimeout(() => {
      if (alert) {
        const { title, type, message, options } = alert;
        notify({
          type,
          title,
          message,
          confirmLabel: 'Ok',
          onConfirm: () => {
            closeAlert(options!.onConfirmAction);
          },
        });
      }
    }, 0);


    return (
      <></>
    );
  }
}


Notifications.contextType = NotificationContext;


export default Notifications;
