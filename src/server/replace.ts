import { extname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { FileExtensions } from '../constants/file-extensions';
import { HtmlReplacerStrategy } from '../constants/html-replacer-strategy';
import writeToTranslationFiles from 'src/server/write-to-translation-files';

const replaceAngularHTML = (source: string, word: string, translationKey: string): string => {
  return source.replace(new RegExp(word, 'g'), `{{ '${translationKey}' | i18next }}`);
};

const replaceHTML = (_: string): string => {
  return '';
};

const replace = (
  path: string,
  word: string,
  translation: string,
  translationKey: string,
): boolean => {
  const fileExtension = extname(path);

  if (fileExtension === FileExtensions.HTML) {
    const file = readFileSync(path, 'utf-8');
    const replacedSource =
      process.env.HTML_REPLACER_STRATEGY === HtmlReplacerStrategy.Angular
        ? replaceAngularHTML(file, word, translationKey)
        : replaceHTML(file);

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
