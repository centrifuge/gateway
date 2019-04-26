import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllAccounts, resetGetAllAccounts } from '../store/actions/admin';
import { RequestState } from '../store/reducers/http-request-reducer';
import { Box, DataTable, Heading, Text} from 'grommet';
import { Edit, View } from 'grommet-icons';
import { RouteComponentProps, withRouter } from 'react-router';
import {AccountGetAllAccountResponse} from "../../clients/centrifuge-node";

type AccountsListProps = {
  getAllAccounts: () => void;
  resetGetAllAccounts: () => void;
  accounts?: AccountGetAllAccountResponse;
  loading: boolean;
};

class AccountsList extends React.Component<AccountsListProps & RouteComponentProps> {
  displayName = 'AccountsList';

  componentDidMount() {
    this.props.getAllAccounts();
  }

  componentWillUnmount() {
    this.props.resetGetAllAccounts();
  }

  render() {

    if (this.props.loading || !this.props.accounts
    ) {
      return 'Loading';
    }

    return  (
        <Box fill>
          <Box justify="between" direction="row" align="center">
            <Heading level="3">Account Management</Heading>
          </Box>

          <Box>
            <DataTable
                data={this.props.accounts}
                columns={[
                  {
                    property: 'centrifuge_id',
                    header: 'Centrifuge ID',
                    render: data =>
                        data.identity_id ? <Text>{data.identity_id}</Text> : null,
                  },
                  // {
                  //                   //   property: '_id',
                  //                   //   header: 'Actions',
                  //                   //   render: datum => (
                  //                   //       <Box direction="row" gap="small">
                  //                   //         <View
                  //                   //             onClick={() =>
                  //                   //                 this.props.history.push(
                  //                   //                     adminRoutes.view.replace(':id',datum._id),
                  //                   //                 )
                  //                   //             }
                  //                   //         />
                  //                   //         <Edit
                  //                   //             onClick={() =>
                  //                   //                 this.props.history.push(
                  //                   //                     adminRoutes.edit.replace(':id',datum._id),
                  //                   //                 )
                  //                   //             }
                  //                   //         />
                  //                   //       </Box>
                  //                   //   ),
                  //                   // },
                ]}
            />
          </Box>
        </Box>
    );
  }
}

export default connect(
    (state: {
      admin: {
        get: RequestState<AccountGetAllAccountResponse>;
      };
    }) => {
      return {
        accounts: state.admin.get.data,
      };
    },
    {
      getAllAccounts, resetGetAllAccounts
    },
)(withRouter(AccountsList));
