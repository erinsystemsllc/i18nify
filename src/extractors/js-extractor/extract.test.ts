import { extractJs } from '.';

describe('JS extract', () => {
  test('should extract string literals from code', () => {
    const sourceCode = 'let foo = "bar"';
    const result = extractJs(sourceCode);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('bar');
  });
});
