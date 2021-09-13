import React from 'react';

export type TableRowItem = {
  key: React.Key;
  fileName: string;
  path: string;
  word: string;
  translation: string;
  translationKey: string;
};
