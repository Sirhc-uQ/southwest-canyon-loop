import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
mkdirSync(join(root, 'dist'), { recursive: true });
cpSync(join(root, 'docs'), join(root, 'dist'), { recursive: true, force: true });
console.log('Static site copied to dist/');
