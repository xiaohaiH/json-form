const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(__dirname, '..');

const { loadModule, reexport, writeContent } = require('./utils.cjs');

const ElementPlus = loadModule('element-plus');
const isDebug = false;
if (ElementPlus && (isDebug || dir.includes('node_modules'))) {
    const newContent = reexport(fs.readFileSync(path.join(dir, './components/component-definition/definition.ts'), 'utf-8'), ElementPlus);
    writeContent(path.join(dir, './components/component-definition/components.ts'), newContent);
}
