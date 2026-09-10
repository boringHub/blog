---
title: 柒仔的小窝
published: 2026-09-10
description: 基于 Firefly 模板的个人博客项目，使用 Astro 和 Svelte 构建，支持书签导航、全文搜索等功能。
image: /assets/images/projects/Snipaste_2026-09-10_15-59-50.png
tags: [Astro, Svelte, 博客, 二次开发, Firefly]
link:
  - label: GitHub
    icon: fa7-brands:github
    value: https://github.com/boringHub/blog
status: 进行中
lang: zh_CN
---

## 项目简介

柒仔的小窝是一个基于 Firefly 模板的个人博客项目，使用 Astro 和 Svelte 技术栈构建。项目在原有模板基础上进行了二次开发，添加了个人书签工具箱、导航优化等功能，旨在打造一个美观、易用且可定制的个人博客系统。

## 技术栈

### 前端框架

- **Astro** - 内容驱动型网站的 Web 框架
- **Svelte** - 编译为高效原生 JS 的组件框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 功能强大的 CSS 框架

### 功能组件

- **Pagefind** - 全文搜索
- **astro-icon** - 图标系统
- **Fancybox** - 图片灯箱
- **Twikoo** - 评论系统

### 开发工具

- **pnpm** - 包管理器
- **Biome** - 代码检查和格式化
- **Vite** - 构建工具

## 核心功能

### 基础功能

- 响应式布局，适配桌面端、平板和移动端
- Markdown / MDX 文章内容支持
- 多语言界面（中文、英文、日文、韩文）
- Pagefind 全文搜索
- 分类、标签、归档和系列导航
- RSS、Atom、站点地图和 SEO 优化

### 二次开发功能

- **个人书签工具箱** - 本地存储、导入导出、拖拽排序
- **书签导航** - 分类管理、Favicon 自动获取
- **下拉菜单优化** - 更好的交互体验
- **配置系统** - TypeScript 类型安全的配置管理

### 特色功能

- 动态内容展示
- 相册和项目展示
- 音乐播放器
- 主题色和亮暗色模式
- 壁纸配置
- 评论和统计功能

## 项目结构

```text
src/components/   可复用 Astro / Svelte 组件
src/config/       博客功能和站点配置
src/content/      文章、项目和动态内容
src/layouts/      页面布局
src/pages/        页面与路由
src/plugins/      Markdown / MDX 插件
src/styles/       全局样式
public/           静态资源
scripts/          开发和构建脚本
```

## 二次开发记录

### 主要改动

1. **个人书签工具箱** - 添加 `PersonalBooknav.svelte` 组件，实现本地书签管理
2. **书签导航优化** - 重构 `DropdownMenu.astro`，提升交互体验
3. **文档重写** - 精简 README，突出项目定位和使用说明
4. **配置系统** - 完善 TypeScript 类型定义，确保配置安全

### 技术实现

- **Astro + Svelte 混合架构** - 静态页面 + 动态交互
- **localStorage 状态管理** - 浏览器原生存储方案
- **配置驱动开发** - 功能配置与代码分离
- **类型安全** - TypeScript 类型定义

## 本地开发

环境要求：

- Node.js >= 22
- pnpm >= 9

安装依赖并启动开发服务器：

```bash
pnpm install
pnpm dev
```

启动后访问 http://localhost:4321。

常用命令：

```bash
pnpm check       # Astro 检查
pnpm type-check  # TypeScript 检查
pnpm lint        # Biome 检查
pnpm build       # 构建生产版本
pnpm preview     # 预览生产构建
```

## 部署

项目构建产物位于 `dist/`，可以部署到支持 Astro 静态站点的托管平台：

- **Vercel** - 推荐的部署平台
- **Cloudflare Pages** - 全球 CDN 加速
- **Netlify** - 静态站点托管
- **GitHub Pages** - 免费的静态站点托管

部署前请根据实际环境配置站点地址、评论、统计服务和其他外部服务参数。

## 项目特色

- **基于成熟模板** - 使用 Firefly 模板，保证代码质量和功能完整性
- **二次开发定制** - 根据个人需求进行功能扩展和优化
- **现代技术栈** - 使用 Astro、Svelte、TypeScript 等现代前端技术
- **配置驱动** - 通过配置文件控制功能，便于维护和扩展
- **类型安全** - TypeScript 类型定义，减少运行时错误
- **响应式设计** - 完美适配各种设备和屏幕尺寸

## 后续计划

- 完善书签工具箱的移动端适配
- 添加更多书签分类和标签功能
- 优化书签搜索和过滤功能
- 考虑添加云同步功能
- 持续优化博客内容和用户体验

## 开源说明

本项目基于以下开源项目进行二次开发：

- [saicaca/fuwari](https://github.com/saicaca/fuwari) - 原始博客模板
- [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) - Firefly 模板

感谢原项目作者和贡献者的辛勤工作。

---

柒仔的小窝致力于记录技术学习、生活思考与成长点滴，打造一个温暖、有深度的个人空间。
