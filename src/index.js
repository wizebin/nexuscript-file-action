import { wrapAction } from 'nexusdk';
import fs from 'fs';
import path from 'path';

function assureDirExists(targetDir, { relativeToSource = false } = {}) {
  const normalizedDir = path.normalize(targetDir);
  const pathSeparator = path.sep;
  const initialDir = path.isAbsolute(targetDir) ? pathSeparator : '';
  const baseDir = relativeToSource ? __dirname : '.';

  targetDir.split(pathSeparator).reduce((parentDir, childDir) => {
    const currentDir = path.resolve(baseDir, parentDir, childDir);
    if (!fs.existsSync(currentDir)) {
      fs.mkdirSync(currentDir);
    }

    return currentDir;
  }, initialDir);
}

wrapAction((properties, sendMessage) => {
  const { filename, data, encoding = 'json', append = false } = properties;
  assureDirExists(path.dirname(filename));
  const flag = append ? 'a+' : 'w';
  fs.writeFile(filename, data, { flag });
  return { result: 'success', filename };
})
