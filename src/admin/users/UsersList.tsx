import React from 'react';
import { Anchor, Box, Button, DataTable, Heading, Text } from 'grommet';
import { User } from '../../common/models/user';
import { Modal } from '@centrifuge/axis-modal';
import UserForm from './UserForm';
import { formatDate } from '../../common/formaters';
import { Preloader } from '../../components/Preloader';
import { SecondaryHeader } from '../../components/SecondaryHeader';
import { DisplayField } from '@centrifuge/axis-display-field';
import { Schema } from '../../common/models/schema';
import { mapSchemaNames } from '../../common/schema-utils';
import { PERMISSIONS } from '../../common/constants';
import { httpClient } from '../../http-client';
import { getAddressLink } from '../../common/etherscan';


type Props = {}

type State = {
  loading: boolean;
  userFormOpened: boolean;
  users: User[];
  schemas: Schema[];
  selectedUser: User;
  error: any;
}

class UsersList extends React.Component<Props, State> {
  displayName = 'UsersList';

  state = {
    loading: true,
    userFormOpened: false,
    selectedUser: new User(),
    users: [],
    schemas: [],
    error: null,
  } as State;

  componentDidMount() {
    this.loadData();
  }

  handleHttpClientError = (error) => {
    this.setState({
      loading: false,
      error,
    });
  };


  loadData = async () => {
    this.setState({
      loading: true,
    });
    try {

      const users = (await httpClient.user.list()).data;
      const schemas = (await httpClient.schemas.list({ archived: { $exists: false, $ne: true } })).data;

      this.setState({
        loading: false,
        userFormOpened: false,
        users,
        schemas,
      });

    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  closeUserForm = () => {
    this.setState({ userFormOpened: false });
  };

  openUserForm = (user: User) => {
    this.setState({
      selectedUser: user,
      userFormOpened: true,
    });
  };


  onUserFormSubmit = async (user: User) => {
    this.setState({
      loading: true,
    });
    try {

      if (user._id) {
        await httpClient.user.update(user);
      } else {
        await httpClient.user.invite(user);
      }
      this.loadData();
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };


  mapSchemaNames = (userSchemas, schemas) => {
    if (!schemas || !schemas.data) return [];

  };


  renderUsers = (data, schemas) => {

    return (
      <DataTable
        data={data}
        primaryKey={'_id'}
        sortable={true}
        columns={[
          {
            property: 'name',
            header: 'Name',
            render: data =>
              data.name ? <Text>{data.name}</Text> : null,
          },
          {
            property: 'email',
            header: 'Email',
            render: data =>
              data.email ? <Text>{data.email}</Text> : null,
          },
          {
            property: 'account',
            header: 'Centrifuge ID',
            render: data =>
              data.account ? <DisplayField
                link={{
                  href: getAddressLink(data.account),
                  target: '_blank',
                }}
                value={data.account}
              /> : null,
          },
          {

            property: 'createdAt',
            header: 'Date added',
            render: data =>
              data.createdAt ? <Text>{formatDate(data.createdAt)}</Text> : null,
          },
          {
            property: 'enabled',
            header: 'Status',
            render: data =>
              data.enabled ? <Text color="status-ok">Active</Text> : <Text color="status-warning">Created</Text>,
          },
          {
            property: 'permissions',
            sortable: false,
            header: 'User rights',
            render: data => {
              return data.permissions.join(', ');
            },
          },
          {
            property: 'schemas',
            sortable: false,
            header: 'Document schemas',
            render: data => {// User has not schemas display
              if (!Array.isArray(data.schemas)) return '';
              const activeSchemas = mapSchemaNames(data.schemas, schemas)
                .map(s => s.name).join(', ');
              if (data.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS) && activeSchemas.length === 0) {
                return <Text color="status-error">User should have at least one active schema assigned</Text>;
              }

              return activeSchemas;
            },
          },
          {
            property: 'actions',
            sortable: false,
            header: 'Actions',
            render: data => (
              <Box direction="row" gap="small">

                <Anchor
                  label={'Edit'}
                  onClick={() =>
                    this.openUserForm(data)
                  }
                />
              </Box>
            ),
          },
        ]}
      />
    );
  };


  render() {
    const { loading, users, schemas, selectedUser } = this.state;
    if (loading) {
      return <Preloader message="Loading"/>;
    }


    return (
      <Box fill>
        <Modal
          opened={this.state.userFormOpened}
          headingProps={{ level: 3 }}
          width={'large'}
          title={selectedUser._id ? 'Edit user' : 'Create user'}
          onClose={this.closeUserForm}
        >
          <UserForm schemas={schemas} user={selectedUser} onSubmit={this.onUserFormSubmit}
                    onDiscard={this.closeUserForm}/>
        </Modal>
        <SecondaryHeader>
          <Heading level="3">User Management</Heading>
          <Box>
            <Button
              primary
              label="Create User"
              onClick={() =>
                this.openUserForm(new User())
              }/>
          </Box>
        </SecondaryHeader>
        <Box pad={{ horizontal: 'medium' }}>
          {this.renderUsers(users, schemas)}
        </Box>
      </Box>
    );
  }
}



export default UsersList;
