const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(__dirname, '..');

const { loadModule, reexport, writeContent } = require('./utils.cjs');

const ElementPlus = loadModule('element-plus');
if (ElementPlus) {
    const newContent = reexport(fs.readFileSync(path.join(dir, 'components', 'components-whole.ts'), 'utf-8'), ElementPlus);
    writeContent(path.join(dir, 'components', 'components.ts'), newContent);
}
