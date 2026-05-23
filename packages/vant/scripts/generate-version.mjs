import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** 获取当前文件的目录名 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 获取 package.json 的路径 */
const packageJsonPath = resolve(__dirname, '../package.json');

/** 读取 package.json 文件内容 */
const packageJson = readFileSync(packageJsonPath, 'utf8');

/** 解析 JSON 数据 */
const packageData = JSON.parse(packageJson);

/** 获取版本号 */
const version = packageData.version;

/** 生成版本号文件 */
const versionFilePath = resolve(__dirname, '../src/version.ts');
const versionFileContent = `/** 版本号 */\nexport const version = '${version}';\n`;

/** 写入版本号文件 */
writeFileSync(versionFilePath, versionFileContent);
