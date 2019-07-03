import React from 'react';
import { Box, FormField, TextArea, TextInput } from 'grommet';
import { Invoice } from '../common/models/invoice';
import { LabelValuePair } from '../common/interfaces';
import { Formik } from 'formik';
import { ConnectedSenderForm } from './invoice-form-partials/SenderForm';
import { ConnectedRecipientForm } from './invoice-form-partials/RecipientForm';
import { ConnectedDetailsForm } from './invoice-form-partials/DetailsForm';
import * as Yup from 'yup';
import { Section } from '../components/Section';

type InvoiceFormProps = {
  onSubmit: (invoice: Invoice) => void;
  contacts: LabelValuePair[];
  invoice: Invoice;
};

export default class InvoiceForm extends React.Component<InvoiceFormProps> {
  displayName = 'CreateEditInvoice';
  static defaultProps: InvoiceFormProps = {
    onSubmit: (invoice: Invoice) => {
      // do nothing
    },
    invoice: { currency: 'USD' },
    contacts: [],
  };

  state = { submitted: false };

  onSubmit = (values: Invoice) => {
    return this.props.onSubmit({ ...values });
  };


  render() {

    const { submitted } = this.state;
    const { invoice } = this.props;
    const columnGap = 'medium';
    const sectionGap = 'none';


    const invoiceValidation = Yup.object().shape({
      number: Yup.string()
        .max(40, 'Please enter no more than 40 characters')
        .required('This field is required'),
      sender: Yup.string()
        .required('This field is required'),
      bill_to_company_name: Yup.string()
        .required('This field is required'),
      currency: Yup.string()
        .required('This field is required'),
      status: Yup.string()
        .required('This field is required'),
      net_amount: Yup.number()
        .moreThan(0,'must be greater than 0')
        .required('This field is required'),
      date_created: Yup.date()
        .typeError('Wrong date format')
        .required('This field is required'),
      date_due: Yup.date()
        .typeError('Wrong date format')
        .required('This field is required'),
    });

    return (
      <Box pad={{ bottom: 'xlarge' }}>
        <Formik
          validationSchema={invoiceValidation}
          initialValues={invoice}
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
               handleSubmit,
             }) => (
              <form
                onSubmit={event => {
                  this.setState({ submitted: true });
                  handleSubmit(event);
                }}
              >
                {/* Header */}
                {this.props.children}

                {/* Body */}
                <Box direction="column" gap={sectionGap}>
                  {/* Invoice number section */}
                  <Section>
                    <FormField
                      label="Invoice number"
                      error={errors!.number}
                    >
                      <TextInput
                        name="number"
                        value={values!.number}
                        onChange={handleChange}
                      />
                    </FormField>
                  </Section>


                  {/*Sender and Recipient */}
                  <Box direction="row" gap={columnGap}>
                    <ConnectedSenderForm columnGap={columnGap} contacts={this.props.contacts}/>
                    <ConnectedRecipientForm columnGap={columnGap} contacts={this.props.contacts}/>
                  </Box>

                  {/* Invoice details section */}
                  <Box gap={columnGap}>
                    <ConnectedDetailsForm columnGap={columnGap}/>
                  </Box>

                  {/*Ship to and Remit to */}
                  {/*<Box direction="row" gap={columnGap}>
                    <ConnectedShipToForm columnGap={columnGap}/>
                    <ConnectedRemitToForm columnGap={columnGap}/>
                  </Box>*/}

                  {/* Credit note section */}
                  {/* <Box direction="row" gap={columnGap}>
                    <ConnectedCreditNoteForm columnGap={columnGap}/>
                  </Box>*/}

                  <Box direction="row" gap={columnGap}>
                    {/* Comments section */}
                    <Section headingLevel="5" title="Comments" basis={'1/2'}>
                      <FormField
                        error={errors!.comment}
                      >
                      <TextArea
                        name="comment"
                        value={values!.comment || ''}
                        onChange={handleChange}
                      />
                      </FormField>
                    </Section>

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


