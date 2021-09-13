import { JSDOM } from 'jsdom';
import domWalker from '../dom-walker';
import { isEmpty } from 'lodash';

describe('Dom traversal', () => {
  test('should traverse dom', () => {
    const dom = new JSDOM(`
      <div>
        <div>
          <p>Hello, World</p>
        </div>
      </div>
      <span>Foo bar</span>
    `);

    const results: string[] = [];
    domWalker(dom.window.document.body, (node) => {
      if (node?.nodeType === 3 && node.nodeValue && !isEmpty(node.nodeValue.trim())) {
        results.push(node.nodeValue);
      }
    });

    expect(results.length).toEqual(2);
    expect(results[0]).toBe('Hello, World');
    expect(results[1]).toBe('Foo bar');
  });

  test('modify attributes of text nodes', () => {
    const dom = new JSDOM(`
      <cashbook-stats-wrapper>
        <div>
          <p>Hello, World</p>
        </div>
      </cashbook-stats-wrapper>
      <span>Foo bar</span>
    `);

    domWalker(dom.window.document.body, (node) => {
      if (node?.nodeType === 3 && node.nodeValue && !isEmpty(node.nodeValue.trim())) {
        node.parentElement?.setAttribute('translation', 'translation.key');
      }
    });

    console.log(dom.serialize());
  });

  test('traverse dom as promise', async () => {
    const dom = new JSDOM(`
      <cashbook-stats-wrapper>
        <div>
          <p>Hello, World</p>
        </div>
      </cashbook-stats-wrapper>
      <span>Foo bar</span>
    `);

    const traverse = new Promise<void>((resolve) => {
      domWalker(dom.window.document.body, (node) => {
        if (node?.nodeType === 3 && node.nodeValue && !isEmpty(node.nodeValue.trim())) {
          node.parentElement?.setAttribute('translation', 'translation.key');
        }
        if (!node?.hasChildNodes() && !node?.nextSibling) {
          resolve();
        }
      });
    });

    await traverse;
    console.log(dom.serialize());
  });

  test('remove node', async () => {
    const dom = new JSDOM(`
      <cashbook-stats-wrapper>
        <div>
          <p>Hello, World</p>
        </div>
      </cashbook-stats-wrapper>
      <span>Foo bar</span>
    `);

    const traverse = new Promise<void>((resolve) => {
      domWalker(dom.window.document.body, (node) => {
        if (node?.nodeType === 3 && node.nodeValue && !isEmpty(node.nodeValue.trim())) {
          node.parentElement?.setAttribute('translation', 'translation.key');
          node.parentElement?.removeChild(node);
        }
        if (!node?.hasChildNodes() && !node?.nextSibling) {
          resolve();
        }
      });
    });

    await traverse;
    console.log(dom.serialize());
  });
});
