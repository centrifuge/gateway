import React from 'react';
import { Formik } from 'formik';
import {Box, TextArea, Button, FormField} from 'grommet';
import * as Yup from 'yup';

interface SchemasProps {
  selectedSchema: any;
  onDiscard: () => void;
  onSubmit: (schema) => void;
}

interface SchemasState {
  submitted: boolean;
}

export default class SchemasViewUpdateForm extends React.Component<SchemasProps, SchemasState> {
  state = {
    submitted: false
  };

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
                JSON.parse(value);
              } catch (e) {
                return false;
              }
              return true;
            }),
            message:'Schema is not a valid JSON object'
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
    const { selectedSchema } = this.props;

    return (
        <Box width={'large'} height={'large'}>
        <Formik
            enableReinitialize={true}
            initialValues={selectedSchema}
            validateOnBlur={submitted}
            validateOnChange={submitted}
            validationSchema={jsonValidation}
            onSubmit={async (values, {setSubmitting}) => {
              if (!values) return;
              await this.onSubmit(values);
              setSubmitting(true);
            }}
        >
          {
            ({
               values,
               errors,
               setValues,
               handleChange,
               handleSubmit,
             }) => (
                <form
                    onSubmit={event => {
                      this.setState({submitted: true});
                      handleSubmit(event);
                    }}>
                  <Box width={'large'} height={'large'}>
                    <Box height={'large'} margin={{vertical: 'medium'}}>

                      <FormField
                          component={TextArea}
                          pad={true}
                          label="Please note that only edits to the registries will be saved.
                          Any changes to the name or attributes of a schema will be discarded."
                          error={errors!.json}
                      >
                        <Box height={'large'} width={'large'} margin={{top: 'medium'}}>
                        <TextArea
                            spellCheck={false}
                            fill={true}
                            id={"json"}
                            resize={false}
                            defaultValue={values.json}
                            onChange={handleChange}
                        />
                        </Box>
                      </FormField>

                    </Box>
                    <Box direction="row" justify={'end'} gap={'medium'}>
                      <Button
                          label="Discard Changes"
                          onClick={this.props.onDiscard}
                      />
                      <Button
                          type="submit"
                          primary
                          label="Update"
                      />
                    </Box>
                  </Box>
                </form>
            )
          }
        </Formik>
        </Box>
    )
  }
}
