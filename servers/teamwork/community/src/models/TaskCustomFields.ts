/**
 * CustomFields is the custom fields type.
 */
export interface TaskCustomFields {
  Values?: CustomFieldValue[];
}

/**
 * CustomFieldValue contains all the information returned from a customfield.
 */
export interface CustomFieldValue {
  countryCode?: string;
  currencySymbol?: string;
  customfieldId?: number;
  urlTextToDisplay?: string;
  value?: any;
} 