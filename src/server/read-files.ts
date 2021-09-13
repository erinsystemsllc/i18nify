import { join } from 'path';
import { PathLike, readdirSync, statSync } from 'fs';

const isDirectory = (path: PathLike): boolean => statSync(path).isDirectory();
const getDirectories = (path: PathLike): string[] =>
  readdirSync(path)
    .map((name) => join(path.toString(), name))
    .filter(isDirectory);

const isFile = (path: PathLike): boolean => statSync(path).isFile();
const getFiles = (path: PathLike): string[] =>
  readdirSync(path)
    .map((name) => join(path.toString(), name))
    .filter(isFile);

const getFilesRecursively = (path: PathLike): string[] => {
  const dirs = getDirectories(path);
  const files = dirs.map((dir) => getFilesRecursively(dir)).reduce((a, b) => a.concat(b), []);
  return files.concat(getFiles(path));
};

export default getFilesRecursively;
