/**
 * NullableTaskPriority implements json.Unmarshaler to allow testing
 * between a value that explicitly set to null or omitted.
 */
export interface PayloadNullableTaskPriority {
  Null?: boolean;
  Set?: boolean;
  Value?: 'low' | 'medium' | 'high';
} 