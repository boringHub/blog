# 流萤 / Firefly

一个基于 Astro 的个人博客项目，由 `boringHub` 维护。项目基于开源博客主题进行二次开发，结合实际使用需求，对页面布局、内容组织、主题配置和交互功能进行了持续定制与扩展。

仓库地址：<https://github.com/boringHub/blog>

## 项目定位

本项目是面向个人博客场景的 Astro + Svelte 二次开发版本，不是对源项目的简单复制。项目保留了成熟的技术架构，并围绕个人内容、视觉风格、功能组件和部署方式进行了调整。

二次开发主要包括：

- 自定义站点配置、导航和页面布局
- 调整首页、文章页、归档页及专题页面
- 扩展动态、相册、项目、音乐和互动组件
- 定制主题色、壁纸、字体、评论和统计功能
- 根据实际内容维护文章、项目和站点资源
- 持续优化桌面端和移动端体验

## 主要功能

- 基于 Astro 的静态博客生成
- Svelte 交互组件支持
- 响应式布局，适配桌面端、平板和移动端
- Markdown / MDX 文章内容
- 多语言界面支持
- Pagefind 全文搜索
- 分类、标签、归档和系列导航
- 动态内容、相册和项目展示
- 主题色、亮暗色模式和壁纸配置
- 评论、统计、音乐播放器等可选功能
- RSS、Atom、站点地图和 SEO 页面

## 技术栈

- [Astro](https://astro.build)
- [Svelte](https://svelte.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [Pagefind](https://pagefind.app/)
- [pnpm](https://pnpm.io/)

## 本地开发

环境要求：

- Node.js >= 22
- pnpm >= 9

安装依赖并启动开发服务器：

```bash
pnpm install
pnpm dev
```

启动后访问 <http://localhost:4321>。

常用命令：

```bash
pnpm check       # Astro 检查
pnpm type-check  # TypeScript 检查
pnpm lint        # Biome 检查
pnpm build       # 构建生产版本
pnpm preview     # 预览生产构建
```

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

## 部署

项目构建产物位于 `dist/`，可以部署到支持 Astro 静态站点的托管平台。部署前请根据实际环境配置站点地址、评论、统计服务和其他外部服务参数。

## 开源来源与版权说明

本项目基于 [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly) 进行个人博客二次开发；Firefly 的基础项目是 [saicaca/fuwari](https://github.com/saicaca/fuwari)。感谢两者的作者和贡献者。主题原有功能不代表本仓库独立开发成果。

保留原项目版权声明：

- Copyright (c) 2024 saicaca — fuwari
- Copyright (c) 2025 CuteLeaf — Firefly

流萤相关图片素材版权归《崩坏：星穹铁道》开发商米哈游所有；感谢 `霞葉` 的 [Bangumi 收藏页面参考](https://kasuha.com/posts/fuwari-enhance-ep2/) 和 `公公的日常` 提供的 [流萤看板娘 Spine 切片数据](https://www.bilibili.com/video/BV1fuVzzdE5y)。

项目中的第三方图片、字体、模型、脚本和其他资源，其版权归相应权利人所有。使用或再分发相关资源时，请遵守其原始许可证和版权要求。

本项目自身的许可信息请参阅 [LICENSE](LICENSE)。

## 维护

本仓库是个人博客的持续开发版本。功能和配置会根据实际使用情况持续调整，欢迎通过 [Issues](https://github.com/boringHub/blog/issues) 提交问题或建议。
