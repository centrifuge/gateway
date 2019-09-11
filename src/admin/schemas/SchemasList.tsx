import React from 'react';
import { Anchor, Box, Button, CheckBox, DataTable, Heading, Text } from 'grommet';
import { Modal } from '@centrifuge/axis-modal';
import { Schema } from '../../common/models/schema';
import { SecondaryHeader } from '../../components/SecondaryHeader';
import { formatDate } from '../../common/formaters';
import { Preloader } from '../../components/Preloader';
import { RouteComponentProps, withRouter } from 'react-router';
import SchemasForm from './SchemasForm';
import { httpClient } from '../../http-client';


interface Props extends RouteComponentProps {

};

interface State {
  schemas: Schema[];
  loading: boolean;
  selectedSchema: Schema | null;
  showArchive: boolean;
  formMode: FormModes;
  openedSchemaForm: boolean;
  error: any,
}

/**
 * Holds the Schema form modes
 */
enum FormModes {
  EDIT = 'edit',
  CREATE = 'create',
  VIEW = 'view',
}

/**
 * Mapping for different states and components
 */
const formModePropMapping = {
  [FormModes.EDIT]: {
    schemaForm: {
      submitLabel: 'Update',
      readonly: false,
      infoParagraph: 'Please note that only edits to the registries will be saved. Any changes to the name or attributes of a schema will be discarded.',
    },
    modal: {
      title: 'Edit Schema',
    },
  },
  [FormModes.CREATE]: {
    schemaForm: {
      submitLabel: 'Create',
      readonly: false,
      infoParagraph: 'Please note that the schema must be a valid JSON object.',
    },
    modal: {
      title: 'Create Schema',
    },
  },
  [FormModes.VIEW]: {
    schemaForm: {
      submitLabel: '',
      readonly: true,
      infoParagraph: '',
    },
    modal: {
      title: 'View Schema',
    },
  },

};


class SchemasList extends React.Component<Props, State> {
  state = {
    loading: true,
    schemas: [],
    selectedSchema: null,
    formMode: FormModes.CREATE,
    openedSchemaForm: false,
    showArchive: false,
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

      const schemas = (await httpClient.schemas.list()).data;

      this.setState({
        loading: false,
        schemas,
      });

    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  handleSubmit = async (schema: Schema) => {
    const { selectedSchema } = this.state;
    this.closeSchemaModal();
    try {
      if (selectedSchema && (selectedSchema as Schema)._id) {
        await httpClient.schemas.update(schema);
      } else {
        await httpClient.schemas.create(schema);
      }
      this.loadData();
    } catch (e) {
      this.handleHttpClientError(e);
    }

  };

  archiveSchema = async (schema: Schema) => {
    if (!schema._id) throw new Error('Can not archive a schema that does not have _id set');
    this.setState({
      loading: true,
    });
    try {
      await httpClient.schemas.archive(schema._id);
      this.loadData();
    } catch (e) {
      this.handleHttpClientError(e);
    }
  };

  closeSchemaModal = () => {
    this.setState({ selectedSchema: null, openedSchemaForm: false });
  };

  createSchema = () => {
    this.setState({
      selectedSchema: null,
      formMode: FormModes.CREATE,
      openedSchemaForm: true,
    });
  };

  viewSchema = (data) => {
    this.setState({
      selectedSchema: data,
      formMode: FormModes.VIEW,
      openedSchemaForm: true,
    });
  };

  editSchema = (data) => {
    this.setState({
      selectedSchema: data,
      formMode: FormModes.EDIT,
      openedSchemaForm: true,
    });
  };

  renderSchemas = (data) => {

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
            property: 'createdAt',
            header: 'Date added',
            render: data =>
              data.createdAt ? <Text>{formatDate(data.createdAt)}</Text> : null,
          },
          {
            property: 'updatedAt',
            header: 'Date updated',
            render: data =>
              data.updatedAt ? <Text>{formatDate(data.updatedAt)}</Text> : null,
          },
          {
            property: 'actions',
            sortable: false,
            header: 'Actions',
            render: data => {

              let actions = [
                <Anchor
                  label={'View'}
                  onClick={() => {
                    this.viewSchema(data);
                  }}
                />];

              if (!data.archived) {
                actions = [
                  ...actions,
                  <Anchor
                    label={'Edit'}
                    onClick={() => {
                      this.editSchema(data);
                    }}
                  />,
                  <Anchor
                    label={'Archive'}
                    onClick={() => {
                      this.archiveSchema(data);
                    }}
                  />];
              }
              return <Box direction="row" gap="small">
                {actions}
              </Box>;
            },
          },
        ]}
      />
    );
  };

  render() {
    const {
      loading,
      schemas,
      selectedSchema,
      formMode,
      openedSchemaForm,
      showArchive,
    } = this.state;

    if (loading) {
      return <Preloader message="Loading"/>;
    }


    return (
      <Box fill>
        <SecondaryHeader>
          <Heading level="3">Schemas</Heading>
          <Box direction={'row'} gap={'medium'}>
            <CheckBox
              label={'Show Archived'}
              checked={showArchive}
              onChange={(event) => this.setState({ showArchive: event.target.checked })}

            />
            <Button
              primary
              onClick={this.createSchema}
              label="Create Schema"
            />
          </Box>

        </SecondaryHeader>
        <Modal
          opened={openedSchemaForm}
          width={'xlarge'}
          headingProps={{ level: 3 }}
          {...formModePropMapping[formMode].modal}
          onClose={this.closeSchemaModal}
        >
          <SchemasForm
            {...formModePropMapping[formMode].schemaForm}
            selectedSchema={selectedSchema || Schema.getDefaultValues()}
            onSubmit={this.handleSubmit}
            onDiscard={this.closeSchemaModal}
          />
        </Modal>
        <Box pad={{ horizontal: 'medium' }}>
          {this.renderSchemas(
            schemas.filter(
              schema => showArchive === !!schema.archived,
            ),
          )}
        </Box>
      </Box>
    );
  }
}

export default withRouter(SchemasList);
