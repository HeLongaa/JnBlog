#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const postsDirectory = path.join(__dirname, 'content/posts');

// 创建可读的输入接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 生成随机文件名
function generateSlug() {
  return crypto.randomBytes(16).toString('hex');
}

// 询问用户输入
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createPost() {
  console.log('\n📝 创建新文章\n');
  
  try {
    // 获取文章信息
    const title = await question('请输入文章标题: ');
    if (!title.trim()) {
      console.log('❌ 标题不能为空');
      rl.close();
      return;
    }

    const tagsInput = await question('请输入标签（用逗号分隔，例如: 工具,n8n）: ');
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const date = await question('请输入日期（格式: YYYY-MM-DD，留空使用今天）: ') || new Date().toISOString().split('T')[0];
    
    const author = await question('请输入作者（留空使用默认: HeLong）: ') || blogConfig.author;
    
    // 生成文件名
    const slug = generateSlug();
    const fileName = `${slug}.md`;
    const filePath = path.join(postsDirectory, fileName);
    
    // 创建frontmatter
    const frontmatter = `---
title: "${title}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
date: "${date}"
author: "${author}"
---
`;

    // 写入文件
    fs.writeFileSync(filePath, frontmatter, 'utf8');
    
    console.log(`\n✅ 文章创建成功！`);
    console.log(`📄 文件名: ${fileName}`);
    console.log(`📂 路径: ${filePath}`);
    console.log(`\n📝 请编辑文件添加文章内容\n`);
    
  } catch (error) {
    console.error('❌ 创建文章时出错:', error.message);
  } finally {
    rl.close();
  }
}

// 检查posts目录是否存在
if (!fs.existsSync(postsDirectory)) {
  console.log('❌ posts目录不存在，请先创建目录');
  process.exit(1);
}

// 运行脚本
createPost();