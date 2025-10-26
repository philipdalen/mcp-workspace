/**
 * NullableDate implements json.Unmarshaler to allow testing between a value
 * that explicitly set to null or omitted.
 * Date format "2006-01-02"
 */
export interface PayloadNullableDate {
  Null?: boolean;
  Set?: boolean;
  Value?: string;
} 