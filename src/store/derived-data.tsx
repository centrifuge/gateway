import { LabelValuePair } from '../common/interfaces';
import { mapSchemaNames } from '../common/schema-utils';

export const mapContactsToLabelKeyPair = (state, withLoggedinUser = false) => {
  if (!state.contacts.get.data) return undefined;
  const mapped = state.contacts.get.data
    .map(contact => ({
      label: contact.name,
      value: contact.address,
    })) as LabelValuePair[];

  return withLoggedinUser ?
    [
      { label: state.user.auth.loggedInUser.name, value: state.user.auth.loggedInUser.account },
      ...mapped,
    ]
    :
    mapped;
};


export const getUserSchemas = (state) => {
  const schemas = state.schemas.getList.data;
  const userSchemas = state.user.auth.loggedInUser.schemas;
  if (!schemas || !userSchemas) return [];
  return mapSchemaNames(userSchemas, schemas);
};

