import { parse } from 'acorn';
import estraverse, { Syntax } from 'estraverse';
import { isValid } from './validate';

const extract = (sourceCode: string): string[] => {
  try {
    const ast = parse(sourceCode, {
      ecmaVersion: 'latest',
      sourceType: 'module',
    });

    const result: string[] = [];

    estraverse.traverse(ast as any, {
      enter: (node: any, _) => {
        if (node.type === Syntax.Literal) {
          isValid(node.value) && result.push(node.value);
        }
      },
    });

    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default extract;
