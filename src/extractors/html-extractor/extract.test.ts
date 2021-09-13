import { extractHTML } from '.';

describe('HTML extract', () => {
  test('should extract angular HTML', () => {
    const sourceCode = `
      <div>Hello, World</div>
      <p>Foo bar</p>
      <div></div>
    `;

    const result = extractHTML(sourceCode);
    expect(result.length).toBe(2);
    expect(result[0]).toBe('Hello, World');
    expect(result[1]).toBe('Foo bar');
  });
});
