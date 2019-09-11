import React from 'react';

import { connect } from 'react-redux';
import { Contact } from '../common/models/contact';
import ContactList from './ContactList';
import { Preloader } from '../components/Preloader';
import { User } from '../common/models/user';
import { httpClient } from '../http-client';


type Props = {
  loggedInUser: User;
};

interface State {
  loading: boolean,
  error: any,
  contacts: Contact[]
}

class ViewContacts extends React.Component<Props, State> {

  state = {
    loading: true,
    error: null,
    contacts: [],
  };

  async componentDidMount() {
    await this.loadContacts();
  }

  handleHttpClientError = (error) => {
    this.setState({
      loading: false,
      error,
      contacts: [],
    });
  };

  createContact = async (contact: Contact) => {
    this.setState({ loading: true });
    try {
      await httpClient.contacts.create(contact);
      await this.loadContacts();
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  updateContact = async (contact: Contact) => {
    this.setState({ loading: true });
    try {
      await httpClient.contacts.update(contact);
      await this.loadContacts();
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  loadContacts = async () => {
    this.setState({ loading: true });
    try {
      const contacts = (await httpClient.contacts.list()).data;
      this.setState({
        loading: false,
        contacts
      });
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  render() {

    const { loggedInUser } = this.props;
    const { loading, contacts, error } = this.state;

    if (loading) {
      return <Preloader message="Loading"/>;
    }

    if (error) {
      console.log('error', error);
    }

    return (
      <ContactList
        loggedInUser={loggedInUser}
        contacts={contacts as Contact[]}
        createContact={this.createContact}
        updateContact={this.updateContact}
      />
    );
  }
}


const mapStateToProps = (state) => {
  return {
    loggedInUser: state.user.auth.loggedInUser,
  };
};

export default connect(
  mapStateToProps
)(ViewContacts);
