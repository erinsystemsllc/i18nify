import * as dotenv from 'dotenv';
import getFilesRecursively from './read-files';
import { readFileSync } from 'fs';
import { extractJs } from '../extractors';
import { extname, basename } from 'path';
import { FileExtensions } from '../constants/file-extensions';
import Nedb from 'nedb';
import express from 'express';
import { extractHTML } from '../extractors';
import getValidWords from '../server-utils/get-valid-words';
import cors from 'cors';
import replace from './replace';

dotenv.config();

const db = new Nedb();
const app = express();
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
const port = 4000;

const startServer = async (): Promise<void> => {
  const saveValidWords = async (file: string, words: string[]): Promise<void> => {
    await getValidWords(words).then((words) => {
      db.insert({
        fileName: basename(file),
        path: file,
        words,
      });
    });
  };

  if (process.env.PROJECT_PATH) {
    const files = getFilesRecursively(process.env.PROJECT_PATH);
    for (const file of files) {
      const data = readFileSync(file, 'utf-8');
      const extension = extname(file);

      if (extension === FileExtensions.JS) {
        await saveValidWords(file, extractJs(data));
      } else if (extension === FileExtensions.HTML) {
        await saveValidWords(file, extractHTML(data));
      }
    }
  }

  app.get('/words', async (_, res) => {
    const docs = new Promise((resolve, reject) => {
      db.find({}, (err: Error, docs: any[]) => {
        if (err) reject(err);
        return resolve(docs);
      });
    });

    const entries = await docs;

    res.send({ entries });
  });

  app.post('/replace', (req, res) => {
    const { path, word, translation, translationKey } = req.body;
    const isReplaced = replace(path, word, translation, translationKey);
    res.send({ isReplaced });
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/`);
  });
};

startServer();
