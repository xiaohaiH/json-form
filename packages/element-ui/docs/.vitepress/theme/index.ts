import DefaultTheme from 'vitepress/theme';
// @ts-expect-error 忽视 unocss 模块找不到的错误
import 'virtual:uno.css';

export default DefaultTheme;
