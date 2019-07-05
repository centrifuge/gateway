import React from 'react';
import { connect } from 'react-redux';
import { Schema } from "../../common/models/schema";
import { Preloader } from "../../components/Preloader";
import { SchemasList } from "./SchemasList";
import {
  createSchema,
  resetCreateSchema,
  getSchema,
  resetGetSchema,
  getSchemasList,
  resetGetSchemasList,
  updateSchema,
  resetUpdateSchema,
} from "../../store/actions/schemas";
import { RequestState } from "../../store/reducers/http-request-reducer";

const mapStateToProps = (state: {
  schemas: { getList: RequestState<Schema[]> };
}) => {
  return {
    schemas: state.schemas.getList.data,
    loading: state.schemas.getList.loading,
  };
};

type ViewSchemasProps = {
  schemas?: Schema[];
  getSchemasList: () => void;
  resetGetSchemasList: () => void;
  resetCreateSchema: () => void;
  createSchema: (schema: Schema) => void;
  getSchema: () => void;
  resetGetSchema: () => void;
  updateSchema: (schema: Schema) => void;
  resetUpdateSchema: () => void;
  loading: boolean;
};

class ViewSchemas extends React.Component<ViewSchemasProps> {

  componentDidMount() {
    this.props.getSchemasList();
  }

  componentWillUnmount() {
    this.props.resetCreateSchema();
    // this.props.resetGetSchema();
    // this.props.resetUpdateSchema();
  }

  render() {

    if (this.props.loading) {
      return <Preloader message="Loading"/>;
    }

    return (
        <SchemasList
            schemas={this.props.schemas as Schema[]}
            // refresh={this.props.getSchemas}
            create={this.props.createSchema}
            // updateSchema={this.props.updateSchema}
        />
    );
  }
}

export default connect(
    mapStateToProps,
    {
      getSchemasList,
      resetGetSchemasList,
      getSchema,
      resetGetSchema,
      createSchema,
      resetCreateSchema,
      updateSchema,
      resetUpdateSchema,
    },
)(ViewSchemas);
