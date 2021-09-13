import { extname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { FileExtensions } from '../constants/file-extensions';
import writeToTranslationFiles from './write-to-translation-files';
import { JSDOM } from 'jsdom';
import domWalker from '../server/dom-walker';
import { isEmpty } from 'lodash';

const replaceHTML = async (
  source: string,
  word: string,
  translationKey: string,
): Promise<string> => {
  const dom = new JSDOM(source);
  const addTranslationKeys = new Promise<void>((resolve) => {
    domWalker(dom.window.document.body, (node) => {
      if (
        node?.nodeType === 3 &&
        node.nodeValue &&
        !isEmpty(node.nodeValue.trim()) &&
        node.nodeValue === word
      ) {
        node.parentElement?.setAttribute('translate', `${translationKey}`);
      }

      if (!node?.hasChildNodes() && !node?.nextSibling) {
        resolve();
      }
    });
  });
  await addTranslationKeys;
  return dom.window.document.body.innerHTML.replace(new RegExp(word, 'g'), '');
};

const replace = async (
  path: string,
  word: string,
  translation: string,
  translationKey: string,
): Promise<boolean> => {
  const fileExtension = extname(path);

  if (fileExtension === FileExtensions.HTML) {
    const file = readFileSync(path, 'utf-8');
    const replacedSource = await replaceHTML(file, word, translationKey);
    console.log(replacedSource);

    try {
      writeFileSync(path, replacedSource);
    } catch (e) {
      console.error(e);
      return false;
    }

    writeToTranslationFiles(translationKey, word, translation);

    return true;
  }

  return false;
};

export default replace;
