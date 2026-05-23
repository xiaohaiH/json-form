const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(__dirname, '..');

const { loadModule, reexport, writeContent } = require('./utils.cjs');

const Vant = loadModule('vant');
const isDebug = false;
if (Vant && (isDebug || dir.includes('node_modules'))) {
    const newContent = reexport(fs.readFileSync(path.join(dir, './components/component-definition/definition.ts'), 'utf-8'), Vant);
    writeContent(path.join(dir, './components/component-definition/components.ts'), newContent);
}
