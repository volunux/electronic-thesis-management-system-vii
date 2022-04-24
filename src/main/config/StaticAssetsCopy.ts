import * as shell from "shelljs";
import path from 'path';
import fs from 'fs';

let envPath: string = path.join(__dirname, '../../../src/.env');
shell.cp("-R", envPath, "dist/src/");

let webConfig: string = path.join(__dirname, '../../../web.config');
shell.cp("-R", webConfig, "dist/src");

function copyDir(src: string, dest: string) {

  const entries: fs.Dirent[] = fs.readdirSync(src, { withFileTypes: true });
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);

  for (let entry of entries) {
    const srcPath: string = path.join(src, entry.name);
    const destPath: string = path.join(dest, entry.name);
    if (entry.isDirectory()) { copyDir(srcPath, destPath); }
    else { fs.copyFile(srcPath, destPath, function() { }); }
  }
}