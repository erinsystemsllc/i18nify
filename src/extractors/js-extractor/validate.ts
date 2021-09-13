import { isEmpty } from 'lodash';

export const isValid = (value: string | number): boolean => {
  return typeof value === 'string' && !isEmpty(value) && !value.startsWith('import');
};
