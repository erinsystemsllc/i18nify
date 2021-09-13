import { readFileSync, writeFileSync } from 'fs';
import { set, assign } from 'lodash';

const writeToTranslationFiles = (
  translationKey: string,
  word: string,
  translation: string,
): void => {
  if (process.env.TRANSLATION_FILE_DE && process.env.TRANSLATION_FILE_EN) {
    const germanFile = readFileSync(process.env.TRANSLATION_FILE_DE);
    const germanData = JSON.parse(germanFile.toString());
    assign(germanData, set(germanData, translationKey, word));

    const englishFile = readFileSync(process.env.TRANSLATION_FILE_EN);
    const englishData = JSON.parse(englishFile.toString());
    assign(englishData, set(englishData, translationKey, translation));

    writeFileSync(process.env.TRANSLATION_FILE_DE, JSON.stringify(germanData));
    writeFileSync(process.env.TRANSLATION_FILE_EN, JSON.stringify(englishData));
  }
};

export default writeToTranslationFiles;
