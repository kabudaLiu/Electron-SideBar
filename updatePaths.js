const fs = require('fs');
// import fs from 'fs'
// 读取 index.html 文件内容
const indexPath = './dist/index.html';
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// 替换路径
const updatedContent = indexContent
  .replace(/(src|href)="\/assets\//g, '$1="./assets/');

// 写入更新后的内容到 index.html 文件
fs.writeFileSync(indexPath, updatedContent);

