import { convert } from 'html-to-text';
import { isEmpty } from 'lodash';

const extract = (sourceCode: string): string[] => {
  return convert(sourceCode)
    .split('\n')
    .filter((value) => !isEmpty(value));
};

export default extract;
