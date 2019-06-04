import React from 'react';
import { Link } from 'react-router-dom';
import { connect, FormikContext } from 'formik';
import { Invoice } from '../../common/models/invoice';
import { Section } from '../../components/Section';
import { Box, FormField, Select, TextInput } from 'grommet';
import { dateToString, extractDate } from '../../common/formaters';


interface DetailsFormProps {
  columnGap: string;
};

interface ConnectedDetailsFormProps extends DetailsFormProps {
  formik: FormikContext<Invoice>;
};

export class DetailsForm extends React.Component<ConnectedDetailsFormProps> {
  displayName = 'DetailsForm';

  render() {
    const {
      errors,
      values,
      setFieldValue,
      handleChange,
    } = this.props.formik;

    const {
      columnGap,
    } = this.props;

    return (
      <Section headingLevel="5" title="Details">
        <Box direction="row" gap={columnGap}>
          <Box basis={'1/4'}>
            <FormField
              label="Invoice Status"
              error={errors!.status}
            >
              <Select
                placeholder="Select"
                value={values!.status}
                options={['unpaid', 'paid']}
                onChange={({ option }) => setFieldValue('status', option)}
              />
            </FormField>
          </Box>

          <Box basis={'1/4'}>
            <FormField
              label="Currency"
              error={errors!.currency}
            >
              <Select
                placeholder="Select"
                value={values!.currency}
                options={['USD', 'EUR']}
                onChange={({ option }) => setFieldValue('currency', option)}
              />

            </FormField>
          </Box>

          <Box basis={'1/4'}>
            <FormField
              label="Invoice date"
              error={errors!.date_created}
            >
              <TextInput
                name="date_created"
                type="date"
                value={extractDate(values!.date_created)}
                onChange={ev => {
                  setFieldValue('date_created', dateToString(ev.target.value));
                }}
              />
            </FormField>
          </Box>

          <Box basis={'1/4'}>
            <FormField
              label="Due date"
              error={errors!.date_due}
            >
              {console.log(values!.date_due)}
              <TextInput
                name="date_due"
                type="date"
                value={extractDate(values!.date_due)}
                onChange={ev => {
                  console.log(ev.target.value);
                  setFieldValue('date_due', dateToString(ev.target.value));
                }}
              />
            </FormField>
          </Box>
        </Box>
      </Section>

    );

  }
}

export const ConnectedDetailsForm = connect<DetailsFormProps, Invoice>(DetailsForm);


