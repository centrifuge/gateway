import React from 'react';
import { Box, Button, FormField, TextInput } from 'grommet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FundingRequest } from '../common/models/funding-request';
import { SearchSelect } from '@centrifuge/axis-search-select';
import { dateToString, extractDate, getPercentFormat } from '../common/formaters';
import { NumberInput } from '@centrifuge/axis-number-input';
import { DateInput } from '@centrifuge/axis-date-input';
import { Contact } from '../common/models/contact';

type Props = {
  onSubmit: (fundingRequest: FundingRequest) => void;
  onDiscard: () => void;
  contacts: Contact[];
  today: Date;
  fundingRequest: FundingRequest;
};

export default class FundingRequestForm extends React.Component<Props> {
  displayName = 'CreateEditInvoice';
  static defaultProps: Props = {
    onSubmit: (fundingRequest: FundingRequest) => {
      // do nothing by default
    },
    onDiscard: () => {
      // do nothing by default
    },
    today: new Date(),
    fundingRequest: new FundingRequest(),
    contacts: [],
  };

  state = { submitted: false };

  onSubmit = (values: FundingRequest) => {
    return this.props.onSubmit({ ...values });
  };

  onDiscard = () => {
    this.props.onDiscard();
  };


  render() {

    const { submitted } = this.state;
    const { fundingRequest, contacts, today } = this.props;
    const columnGap = 'medium';
    const sectionGap = 'large';


    // TODO Remove this
    fundingRequest.currency = 'USD';

    //const currencyParts = getCurrencyFormat(fundingRequest.currency);
    const percentParts = getPercentFormat();


    const fundingRequestValidation = Yup.object().shape({
      funder: Yup.string()
        .required('This field is required'),
      repayment_amount: Yup.number()
        .required('This field is required'),
      apr: Yup.number()
        .required('This field is required'),
      fee: Yup.number()
        .required('This field is required'),
      repayment_due_date: Yup.date()
        .typeError('Wrong date format')
        .required('This field is required'),

    });

    return (
      <Box width={'large'} pad={{ top: 'large', bottom: 'large' }}>
        <Formik
          validationSchema={fundingRequestValidation}
          initialValues={fundingRequest}
          validateOnBlur={submitted}
          validateOnChange={submitted}
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
               setFieldValue,
               handleSubmit,
             }) => {

              // Calculate days and repayment_amount
              let days, amount, financeRate, feeAmount, financeFee;
              const repaymentDate = new Date(values.repayment_due_date);
              const diff = repaymentDate.getTime() - today.getTime();
              days = Math.ceil(diff / (1000 * 60 * 60 * 24));
              financeRate = values.apr / 360 * days;
              feeAmount = values.fee * values.repayment_amount;
              financeFee = (values.repayment_amount * financeRate + feeAmount).toFixed(2);
              amount = values.repayment_amount - financeFee;

              if (isNaN(amount)) amount = 0;
              if (isNaN(days)) days = 0;
              values.days = days;
              values.amount = amount.toFixed(2);

              return (
                <form
                  onSubmit={event => {
                    this.setState({ submitted: true });
                    handleSubmit(event);
                  }}
                >
                  <Box direction="column" gap={sectionGap}>

                    <Box gap={columnGap}>
                      <Box direction="row" gap={columnGap}>
                        <Box basis={'1/2'} gap={columnGap}>
                          <FormField
                            label="Funder"
                            error={errors!.funder}
                          >
                            <SearchSelect
                              labelKey={'name'}
                              valueKey={'address'}
                              options={contacts}
                              value={
                                contacts.find((c) => {
                                  return c.address!.toLowerCase() === values!.funder.toLowerCase();
                                })
                              }
                              onChange={(selected) => {
                                setFieldValue('funder', selected.address);
                              }}
                            />
                          </FormField>
                        </Box>

                        <Box basis={'1/2'} gap={columnGap} direction="row">

                          <Box basis={'1/2'}>
                            <FormField
                              label="Currency"
                              error={errors!.currency}
                            >

                              <TextInput
                                name="currency"
                                value={values!.currency}
                                onChange={handleChange}
                              />
                            </FormField>
                          </Box>
                        </Box>
                      </Box>

                    </Box>
                    <Box gap={columnGap}>
                      <Box direction="row" gap={columnGap}>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label={`Repayment amount`}
                            error={errors!.repayment_amount}
                          >
                            <NumberInput
                              name="repayment_amount"
                              value={values!.repayment_amount}
                              onChange={({ value }) => {
                                setFieldValue('repayment_amount', value);
                              }}
                            />

                          </FormField>
                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label="APR"
                            error={errors!.apr}
                          >
                            <NumberInput
                              {...percentParts}
                              disabled={true}
                              name="apr"
                              value={values!.apr * 100}
                            />
                          </FormField>
                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label={`Finance fee`}
                            error={errors!.fee}
                          >
                            <NumberInput

                              disabled={true}
                              value={financeFee}
                            />
                          </FormField>
                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label={`Early payment amount`}
                            error={errors!.amount}
                          >
                            <NumberInput
                              name="amount"
                              disabled={true}
                              value={values!.amount}
                            />
                          </FormField>

                        </Box>
                      </Box>
                      <Box direction="row" gap={columnGap}>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label="Early payment date"
                            error={errors!.repayment_due_date}
                          >
                            <DateInput
                              disabled={true}
                              value={extractDate(today)}

                            />
                          </FormField>
                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>
                          <FormField
                            label="Repayment due date"
                            error={errors!.repayment_due_date}
                          >
                            <DateInput
                              name="repayment_due_date"
                              type="date"
                              value={extractDate(values!.repayment_due_date)}
                              onChange={date => {
                                setFieldValue('repayment_due_date', dateToString(date));
                              }}
                            />

                          </FormField>

                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>

                        </Box>
                        <Box basis={'1/4'} gap={columnGap}>

                        </Box>
                      </Box>
                    </Box>

                  </Box>
                  <Box direction="row" justify={'end'} gap="medium" margin={{ top: 'medium' }}>
                    <Button
                      onClick={this.onDiscard}
                      label="Discard"
                    />

                    <Button
                      type="submit"
                      primary
                      label="Request"
                    />
                  </Box>
                </form>
              );
            }
          }
        </Formik>
      </Box>
    );

  }
}

