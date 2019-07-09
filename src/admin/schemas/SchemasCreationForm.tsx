import React from 'react';
import { Formik } from 'formik';
import {Box, TextArea, Button, FormField} from 'grommet';
import * as Yup from 'yup';
import { Schema } from "../../common/models/schema";

interface SchemasCreationProps {
  onDiscard: () => void;
  onSubmit: (schema) => void;
  schema: any
}

interface SchemasState {
  submitted: boolean;
  newSchema?: Schema;
}

export default class SchemasCreationForm extends React.Component<SchemasCreationProps, SchemasState> {
    state = { submitted: false };

    onSubmit = async (input: Object) => {
      this.props.onSubmit(input);
    };

  render() {

    const jsonValidation = Yup.object().shape({
      json: Yup.string()
          .required('Schema is required')
          .test({
            name:'test-json',
            test:(function(this ,value) {
              try {
                JSON.parse(value)
              } catch (e) {
                return false;
              }
              return true;
            }),
            message:'Schema is not a valid JSON object'
          })
          .test({
            name:'test-name',
            test:(function(this ,value) {
              let test
              try {
                test = JSON.parse(value);
              } catch (e) {
                return false
              }
              if (!test.name) {
                return false
              }
              return true;
            }),
            message:'Schema name is required'
          })
          .test({
            name:'test-attributes',
            test:(function(this ,value) {
              let test
              try {
                test = JSON.parse(value);
              } catch (e) {
                return false
              }
              if(!test.attributes) {
                return false
              }
              return true;
            }),
            message:'Schema attributes are required'
          })
          .test({
            name:'test-registries',
            test:(function(this ,value) {
              let test
              try {
                test = JSON.parse(value);
              } catch (e) {
                return false
              }
              if (!test.registries) {
                return false
              }
              return true;
            }),
            message:'At least one registry for this schema  is required'
          }),
    });

    const { submitted } = this.state;
    const { schema } = this.props;


    return (
        <Formik
            initialValues={schema}
            validateOnBlur={submitted}
            validateOnChange={submitted}
            validationSchema={jsonValidation}
            onSubmit={(values, { setSubmitting }) => {
              if (!values) return;
              this.onSubmit(values);
              setSubmitting(true);
            }}
        >
          {
            ({
               values,
               errors,
               handleChange,
               handleSubmit,
            }) => (
                <form
                    onSubmit={event => {
                      this.setState({ submitted: true });
                      handleSubmit(event);
                    }}
                >
                  <Box width={'large'} height={'large'}>
                    <Box height={'large'} margin={{ vertical: 'medium' }}>

                      <FormField
                        component={TextArea}
                        pad={true}
                        label="Please note that the schema must be a valid JSON object"
                        error={errors!.json}
                      >
                        <Box height={'large'} width={'large'} margin={{top: 'medium'}}>
                        <TextArea
                          id={"json"}
                          resize={false}
                          fill={true}
                          onChange={handleChange}
                        />
                        </Box>
                      </FormField>
                    </Box>
                    <Box direction="row" justify={'end'} gap={'medium'}>
                      <Button
                          label="Discard"
                          onClick={this.props.onDiscard}
                      />
                      <Button
                          type="submit"
                          primary
                          label="Create"
                      />
                    </Box>
                  </Box>
                </form>
            )
          }
        </Formik>
    )
  }
}

