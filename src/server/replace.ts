import { extname } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { FileExtensions } from '../constants/file-extensions';
import writeToTranslationFiles from './write-to-translation-files';

const replaceHTML = async (
  source: string,
  word: string,
  translationKey: string,
): Promise<string> => {
  return source.replace(new RegExp(word.trim(), 'g'), `{{::'${translationKey}|translate'}}`);
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
