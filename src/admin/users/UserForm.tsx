import React from 'react';
import { Box, Button, FormField, Text, TextInput } from 'grommet';
import { User } from '../../common/models/user';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { PERMISSIONS } from '../../common/constants';
import MutipleSelect from '../../components/form/MutipleSelect';
import { Schema } from '../../common/models/schema';
import schemas from '../../store/sagas/schemas';

type InviteProps = {
  user: User,
  schemas: Schema[],
  onSubmit: (user) => void;
  onDiscard: () => void;
}

export default class UserForm extends React.Component<InviteProps> {

  state = { submitted: false };

  onSubmit = async (user: User) => {
    this.props.onSubmit(user);
  };


  render() {

    const userValidation = Yup.object().shape({
      name: Yup.string()
        .max(40, 'Please enter no more than 40 characters')
        .required('This field is required'),
      email: Yup.string()
        .email('Please enter a valid email')
        .required('This field is required'),
      permissions: Yup.array()
        .required('This field is required'),
      schemas: Yup.array()
        .transform(function(this, value, originalValye){
          throw new Error('sdsdsd')
        })
        .test({
          name:'test_schemas',
          test:(function(this ,value) {
            if(this.parent.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS)) {
              return (value && value.length)
            }
            this.createError({ path: this.path, message: "BLAB BLAL" })
            return "Some Message";
          }),
          message: (values) => {

            console.log(values)
            return 'This field is required ${path} ${param}'
          }
        })
    });

    const { user, schemas } = this.props;

    const { submitted } = this.state;

    const permissionOptions = [
      PERMISSIONS.CAN_FUND_INVOICES,
      PERMISSIONS.CAN_CREATE_INVOICES,
      PERMISSIONS.CAN_MANAGE_USERS,
      PERMISSIONS.CAN_MANAGE_SCHEMAS,
      PERMISSIONS.CAN_MANAGE_DOCUMENTS,
    ];


    const schemaOptions = schemas.map(i => i.name);

    return (
      <Box width={'medium'} margin={{ vertical: 'medium' }}>
        <Formik
          initialValues={user}
          validateOnBlur={submitted}
          validateOnChange={submitted}
          validationSchema={userValidation}
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
               setFieldValue,
               dirty,
             }) => (
              <form
                onSubmit={event => {
                  this.setState({ submitted: true });
                  handleSubmit(event);
                }}
              >
                <Box gap="small">
                  <FormField
                    label="Name"
                    error={errors.name}
                  >
                    <TextInput
                      name="name"
                      value={values.name || ''}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField
                    label="Email"
                    error={errors!.email}
                  >
                    <TextInput
                      name="email"
                      value={values!.email}
                      onChange={handleChange}
                    />
                  </FormField>

                  <Box margin={{ bottom: 'medium' }}>
                    <FormField
                      label="Permissions"
                      error={errors!.permissions}
                    >
                      <MutipleSelect
                        selected={values.permissions}
                        options={permissionOptions}
                        onChange={(selection) => {
                          setFieldValue('permissions', selection);
                          if(!selection.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS)) {
                            setFieldValue('schemas', []);
                          }
                        }}
                      />

                    </FormField>
                  </Box>

                  {
                    values.permissions.includes(PERMISSIONS.CAN_MANAGE_DOCUMENTS) && <>
                      {schemaOptions && schemaOptions.length > 0 ?
                        <Box margin={{ bottom: 'medium' }}>
                          <FormField
                            label="Document schemas"
                            error={errors!.schemas}
                          >
                            <MutipleSelect
                              selected={values.schemas}
                              options={schemaOptions}
                              onChange={(selection) => {
                                setFieldValue('schemas', selection);
                              }}
                            />

                          </FormField>
                        </Box>
                        :
                        <Text color={'status-warning'}>No schemas in the database. Please add schemas!</Text>
                      }
                    </>
                  }

                  <Box direction="row" justify={'end'} gap={'medium'}>
                    <Button
                      label="Discard"
                      onClick={this.props.onDiscard}
                    />
                    <Button
                      disabled={!dirty}
                      type="submit"
                      primary
                      label={user._id ? 'Update' : 'Create'}
                    />
                  </Box>
                </Box>
              </form>
            )
          }
        </Formik>
      </Box>
    );
  }
}

