---
title: 博客二次开发记录：从 Firefly 模板到个人定制
published: 2026-09-10
description: 记录基于 Firefly 模板进行博客二次开发的过程，包括个人书签工具箱功能的实现、导航优化和文档重写等。
tags: [开发, 博客, Astro, Svelte, 二次开发]
category: 技术
draft: false
pinned: false
comment: true
---

## 背景

最近基于 [Firefly](https://github.com/CuteLeaf/Firefly) 模板进行了博客的二次开发。Firefly 是一个基于 Astro 和 Svelte 的个人博客主题，由 saicaca/fuwari 模板 fork 而来，具有清晰美观的界面和丰富的功能。

选择 Firefly 作为基础模板，主要是因为它已经具备了响应式布局、Markdown 支持、多语言界面、全文搜索等核心功能，可以让我专注于个人需求的定制，而不是从零开始搭建博客系统。

## 主要开发内容

### 1. 个人书签工具箱功能

这是本次二次开发的核心功能。原模板提供了书签导航页面，但缺少个人书签管理功能。我添加了 `PersonalBooknav.svelte` 组件，实现了以下特性：

- **本地存储**：使用 `localStorage` 保存用户的个人书签，支持最多 100 个书签项
- **导入导出**：支持书签数据的导入导出功能，方便数据备份和迁移
- **拖拽排序**：支持书签的拖拽排序，方便用户自定义排列顺序
- **分类管理**：支持书签分类，便于组织和管理

相关配置在 `src/config/booknavConfig.ts` 中：

```typescript
personal: {
  enabled: true,
  storageKey: "boringhub:booknav:personal",
  maxItems: 100,
  enableImportExport: true,
}
```

### 2. 书签导航优化

在个人书签工具箱的基础上，进一步优化了书签导航页面的体验：

- **下拉菜单重构**：重写了 `DropdownMenu.astro` 组件，增加了 154 行代码，提升了菜单的交互体验
- **导航栏配置**：在 `navBarConfig.ts` 中添加了书签导航的配置项，支持更灵活的导航设置
- **Favicon 自动获取**：配置了自动获取网站图标的 API，当书签未填写图标时会自动获取目标站点的 favicon

### 3. 文档重写

对项目 README 进行了全面重写，从原来的 329 行精简到 70 行，重点突出了：

- 项目定位和二次开发说明
- 主要功能和技术栈
- 本地开发和部署指南
- 项目结构说明
- 开源来源和版权说明

### 4. 仓库链接更新

更新了所有 README 文件中的仓库链接，确保指向正确的 GitHub 仓库地址。

## 技术实现

### 组件架构

书签工具箱采用了 Astro + Svelte 的混合架构：

- **Astro 组件**：负责页面布局和静态内容
- **Svelte 组件**：负责交互逻辑和动态功能

这种架构既保证了页面的加载性能，又提供了良好的交互体验。

### 状态管理

个人书签数据使用浏览器原生的 `localStorage` 进行存储，通过自定义的 `personal-booknav.ts` 工具函数进行管理：

```typescript
// src/utils/personal-booknav.ts
export const personalBooknav = {
  get(): BooknavItem[] { /* ... */ },
  set(items: BooknavItem[]): void { /* ... */ },
  add(item: BooknavItem): void { /* ... */ },
  remove(id: string): void { /* ... */ },
  // ...
}
```

### 配置系统

所有配置都集中在 `src/config/` 目录下，采用 TypeScript 类型定义，确保配置的类型安全：

- `booknavConfig.ts`：书签导航配置
- `navBarConfig.ts`：导航栏配置
- `profileConfig.ts`：个人资料配置
- `backgroundWallpaper.ts`：背景壁纸配置

## 开发心得

1. **善用现有模板**：选择成熟的开源模板作为基础，可以大大减少开发工作量，同时保证代码质量
2. **渐进式开发**：先实现核心功能，再逐步优化和完善，避免一次性开发过多功能
3. **配置驱动**：将功能配置与代码分离，便于后续维护和扩展
4. **类型安全**：使用 TypeScript 进行类型定义，可以在开发阶段发现潜在问题

## 后续计划

- 完善书签工具箱的移动端适配
- 添加更多书签分类和标签功能
- 优化书签搜索和过滤功能
- 考虑添加云同步功能

## 总结

通过这次二次开发，不仅获得了符合个人需求的博客系统，也加深了对 Astro、Svelte 等现代前端技术的理解。Firefly 模板提供了良好的基础架构，让我能够专注于功能定制，而不是重复造轮子。

如果你也在寻找一个美观、易用且可定制的博客模板，推荐尝试 Firefly 或其上游项目 fuwari。
