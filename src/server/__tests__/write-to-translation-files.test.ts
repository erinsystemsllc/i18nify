import writeToTranslationFiles from 'src/server/write-to-translation-files';

describe('Write to translation files', () => {
  test('should write to translation file', () => {
    writeToTranslationFiles('views.cashbook.test', 'Stammdaten', 'Master data');
  });
});
