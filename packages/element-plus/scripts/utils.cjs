const fs = require('node:fs');
const path = require('node:path');

const dir = path.resolve(__dirname, '..', 'lib');

function loadModule(name) {
    try {
        return require(name);
    }
    catch (e) {
        return undefined;
    }
}

function writeContent(dest, content) {
    // unlink for pnpm, #92
    try {
        fs.unlinkSync(dest);
    }
    catch (error) { }
    fs.writeFileSync(dest, content, 'utf-8');
}

const reg = /(export\s+\*\s+from\s+'\.\/)([\w|\-]+)(\/index';)/;
const wordReg = /-\w/g;
/** 不经过 element-plus 的组件 */
const whiteList = ['custom-render'];
function reexport(content, Ui) {
    const arr = content.split('\n');
    const newContent = {
        // group/dynamic-group 组件比较特殊, 不能存在于 components-whole 中
        // 避免循环引用, 因此单独提出来
        imp: [`export * from './group/index';`, `export * from './dynamic-group/index';`],
        exp: [],
    };
    arr.forEach((item) => {
        const result = item.match(reg);
        if (!result) return;
        const [all, $1, $2, $3] = result;
        if (whiteList.includes($2) || hasComponent(Ui, $2)) return newContent.imp.push(all);
        newContent.exp.push([
            `export const ${camelize2(`h-${$2}`)} = {};`,
            `export interface ${camelize2(`${$2}-props`)}<A, B, C, D> {}`,
        ].join('\n'));
    });

    return `${[newContent.imp.join('\n'), newContent.exp.join('\n')].filter(Boolean).join('\n\n')}\n`;
}

function hasComponent(Ui, name) {
    return camelize2(`el-${name}`) in Ui;
}
function camelize(name) {
    return name.replace(wordReg, ($1) => $1.slice(1).toUpperCase());
}
function camelize2(name) {
    return camelize(`-${name}`);
}

module.exports.loadModule = loadModule;
module.exports.reexport = reexport;
module.exports.writeContent = writeContent;
