import React from 'react';
import { Add, Checkmark } from 'grommet-icons';
import { Link } from 'react-router-dom';
import { Box, Button, Heading } from 'grommet';
import { Field, Form } from 'react-final-form';
import SearchableDropdown from '../../components/form/SearchableDropdown';
import { LabelValuePair } from '../../interfaces';
import StyledTextInput from '../../components/StyledTextInput';
import { required } from '../../validators';
import { PurchaseOrder } from '../../common/models/dto/purchase-order';

type CreatePurchaseOrderProps = {
  onSubmit: (purchaseOrder: PurchaseOrder) => void;
  onCancel: () => void;
  contacts: LabelValuePair[];
};

export default class CreatePurchaseOrder extends React.Component<
  CreatePurchaseOrderProps
> {
  displayName = 'CreatePurchaseOrder';

  onSubmit = values => {
    const {
      po_number,
      order_name,
      order_street,
      order_city,
      order_zipcode,
      order_country,
      recipient_name,
      recipient_street,
      recipient_city,
      recipient_zipcode,
      recipient_country,
      currency,
      net_amount,
      tax_amount,
      tax_rate,
      recipient,
      order,
      order_amount,
      comment,
      delivery_date,
      date_created,
      collaborators,
    } = values;

    return this.props.onSubmit({
      po_number,
      order_name,
      order_street,
      order_city,
      order_zipcode,
      order_country,
      recipient_name,
      recipient_street,
      recipient_city,
      recipient_zipcode,
      recipient_country,
      currency,
      net_amount,
      tax_amount,
      tax_rate,
      recipient,
      order,
      order_amount,
      comment,
      collaborators,
      delivery_date: new Date(delivery_date).toISOString() as any,
      date_created: new Date(date_created).toISOString() as any,
    });
  };

  private renderButtons() {
    return (
      <Box direction="row" gap="small">
        <Button
          icon={<Checkmark color="white" size="small" />}
          type="submit"
          primary
          label="Save"
        />
        <Button active={false} onClick={this.props.onCancel} label="Discard" />
      </Box>
    );
  }

  private renderOrderNumberSection() {
    return (
      <Box background="white" pad="medium">
        <Field validate={required} name="po_number">
          {({ input, meta }) => (
            <StyledTextInput
              input={input}
              meta={meta}
              label="Purchase order number"
              description="Purchase order number or reference number"
              placeholder="Please enter purchase order number"
            />
          )}
        </Field>
      </Box>
    );
  }

  private renderBuyerSection() {
    return (
      <Box background="white" pad="medium" gap="small">
        <Box direction="row" gap="small">
          <Field
            validate={required}
            name="order"
            items={this.props.contacts}
            // @ts-ignore - necessary until https://github.com/final-form/react-final-form/issues/398 is fixed
            render={({ input, meta, items }) => (
              <SearchableDropdown
                label="Buyer"
                input={input}
                meta={meta}
                items={items}
              />
            )}
          />
          <Field validate={required} name="order_name">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Buyer name"
                description="Name of the buyer company"
                placeholder="Please enter the buyer name"
              />
            )}
          </Field>
        </Box>
        <Box direction="row" gap="small">
          <Field validate={required} name="order_street">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Buyer street"
                placeholder="Please enter the buyer street"
              />
            )}
          </Field>
          <Field validate={required} name="order_country">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Buyer country"
                description="Country ISO code of the buyer of this order"
                placeholder="Please enter the buyer country"
              />
            )}
          </Field>
        </Box>
        <Box direction="row" gap="small">
          <Field validate={required} name="order_city">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Buyer city"
                placeholder="Please enter the buyer city"
              />
            )}
          </Field>
          <Field validate={required} name="order_zipcode">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Buyer ZIP code"
                placeholder="Please enter the buyer ZIP code"
              />
            )}
          </Field>
        </Box>
      </Box>
    );
  }

  private renderRecipientSection() {
    return (
      <Box background="white" pad="medium" gap="small">
        <Box direction="row" gap="small">
          <Field
            validate={required}
            name="recipient"
            items={this.props.contacts}
            // @ts-ignore - necessary until https://github.com/final-form/react-final-form/issues/398 is fixed
            render={({ input, meta, items }) => (
              <SearchableDropdown
                label="Recipient"
                input={input}
                meta={meta}
                items={items}
              />
            )}
          />
          <Field validate={required} name="recipient_name">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Recipient name"
                description="Name of the recipient company"
                placeholder="Please enter the recipient name"
              />
            )}
          </Field>
        </Box>
        <Box direction="row" gap="small">
          <Field validate={required} name="recipient_street">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Recipient street"
                placeholder="Please enter the recipient street"
              />
            )}
          </Field>
          <Field validate={required} name="recipient_country">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Recipient country"
                description="Country ISO code of the recipient of this order"
                placeholder="Please enter the recipient country"
              />
            )}
          </Field>
        </Box>
        <Box direction="row" gap="small">
          <Field validate={required} name="recipient_city">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Recipient city"
                placeholder="Please enter the recipient city"
              />
            )}
          </Field>
          <Field validate={required} name="recipient_zipcode">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Recipient ZIP code"
                placeholder="Please enter the recipient ZIP code"
              />
            )}
          </Field>
        </Box>
      </Box>
    );
  }

  private renderPaymentSection() {
    return (
      <Box background="white" pad="medium" gap="small">
        <Box direction="row" gap="small" align="stretch">
          <Field validate={required} name="currency">
            {({ input, meta }) => (
              <StyledTextInput input={input} meta={meta} label="Currency" />
            )}
          </Field>
          <Field validate={required} name="net_amount">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Net amount"
                placeholder="Please enter the net amount"
              />
            )}
          </Field>
          <Field validate={required} name="order_amount">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Order amount"
                placeholder="Please enter the order amount"
              />
            )}
          </Field>
          <Field validate={required} name="tax_amount">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Tax amount"
                placeholder="Tax amount"
              />
            )}
          </Field>
          <Field validate={required} name="tax_rate">
            {({ input, meta }) => (
              <StyledTextInput input={input} meta={meta} label="Tax Rate" />
            )}
          </Field>
        </Box>
        <Box direction="row" gap="small">
          <Field validate={required} name="delivery_date">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Due date"
                placeholder="Please enter due date"
                type="date"
              />
            )}
          </Field>
          <Field validate={required} name="date_created">
            {({ input, meta }) => (
              <StyledTextInput
                input={input}
                meta={meta}
                label="Date created"
                placeholder="Please enter creation date"
                type="date"
              />
            )}
          </Field>
        </Box>
      </Box>
    );
  }

  private renderCommentsSection() {
    return (
      <Box background="white" pad="medium">
        <Field validate={required} name="comment">
          {({ input, meta }) => (
            <StyledTextInput
              input={input}
              meta={meta}
              label="Comments"
              placeholder="Please enter extra comments"
            />
          )}
        </Field>
      </Box>
    );
  }

  private renderCollaboratorsSection() {
    return (
      <Box background="white" pad="medium">
        <Field
          validate={required}
          name="collaborators"
          items={this.props.contacts}
          // @ts-ignore - necessary until https://github.com/final-form/react-final-form/issues/398 is fixed
          render={({ input, meta, items }) => (
            <SearchableDropdown
              multiple
              label="Collaborators"
              input={input}
              meta={meta}
              items={items}
            />
          )}
        />
      </Box>
    );
  }

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit }) => (
          <Box>
            <form onSubmit={handleSubmit}>
              <Box justify="between" direction="row" align="center">
                <Heading level="3">Create New Purchase Order</Heading>
                {this.renderButtons()}
              </Box>
              <Box>
                <Box direction="column" gap="small">
                  {this.renderOrderNumberSection()}
                  {this.renderBuyerSection()}
                  {this.renderRecipientSection()}
                  {this.renderPaymentSection()}
                  {this.renderCollaboratorsSection()}
                  {this.renderCommentsSection()}
                </Box>
                <Box justify="end" direction="row" margin={{ top: 'small' }}>
                  {this.renderButtons()}
                </Box>
              </Box>
            </form>
          </Box>
        )}
      />
    );
  }
}
