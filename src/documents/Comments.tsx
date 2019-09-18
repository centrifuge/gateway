import React, { FunctionComponent } from 'react';
import { NumberInput } from '@centrifuge/axis-number-input';
import { DateInput } from '@centrifuge/axis-date-input';
import { Attribute, AttrTypes } from '../common/models/schema';
import { Box, FormField, Grid, Select, TextArea, TextInput } from 'grommet';
import { dateToString, extractDate } from '../common/formaters';
import { get } from 'lodash';
import { connect, FormikContext } from 'formik';
import { Document } from '../common/models/document';
import { Section } from '../components/Section';

type Props = OuterProps & {
  formik: FormikContext<Document>
};


interface OuterProps {
  columnGap: string;
  isViewMode: boolean;
}

const Comments: FunctionComponent<Props> = (props: Props) => {

  const {
    columnGap,
    isViewMode,
    formik: {
      values,
      errors,
      handleChange,
      setFieldValue
    }
  } = props;


  const key = `attributes.comments.value`;

  return <Section title="Comments">
    <Grid gap={columnGap}>
      <FormField
        key={key}
        error={get(errors, key)}
      >
          <TextArea
            disabled={isViewMode}
            value={get(values, key)}
            name={`${key}`}
            onChange={handleChange}
          />
      </FormField>
    </Grid>
  </Section>;
};

export default connect<OuterProps>(Comments);
