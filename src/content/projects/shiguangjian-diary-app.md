---
title: 拾光笺
published: 2026-09-23
description: 一款本地优先的私人日记 App，用可旋转、可聚焦的记忆星球承载每一段记录。
image: /assets/images/projects/shiguangjian-memory-planet.png
tags: [Ionic Vue, Capacitor, SQLite, Canvas, Android]
link:
  - label: GitHub
    icon: fa7-brands:github
    value: https://github.com/boringHub/diary-app
  - label: 下载 APK
    icon: material-symbols:android
    value: https://github.com/boringHub/diary-app/releases/latest/download/shiguangjian-android-debug.apk
status: 进行中
lang: zh_CN
---

## 项目简介

拾光笺是一款本地优先的私人日记 App。它没有把日记做成传统列表，而是把每篇记录映射为记忆星球上的一颗星：拖动星球可以回看不同方向的记忆，聚焦某颗星后可以打开对应日记，心情则通过星体颜色呈现。

项目目前处于 Android 开发预览阶段，核心日记流程和本地持久化已经可用。日记数据默认只保存在当前设备，不依赖账号或云端服务。

## 核心体验

- 可旋转、聚焦的 Canvas 记忆星球
- 新建日记后，记录以星体坠入星球的动画出现
- 支持日记新建、编辑、查看、收藏和软删除
- 支持按日期搜索记录
- 使用五种心情状态区分星体颜色
- Web 与 Android 共用页面和状态管理逻辑

## 技术栈

- Ionic Vue 8
- Vue 3、TypeScript、Pinia、Vue Router
- Vite 6、Vitest
- Capacitor 8
- HTML5 Canvas
- Android SQLite

## 本地优先的数据架构

页面和 Pinia Store 不直接依赖具体存储实现，而是通过异步 `DiaryRepository` 接口读写数据：

- 浏览器开发环境使用 `LocalStorageDiaryRepository`
- Android 原生环境使用 `SQLiteDiaryRepository`
- Capacitor 负责平台识别和原生能力接入

SQLite V1 已建立以下数据表：

- `diaries`：日记基础信息
- `diary_blocks`：文本和后续图片等内容块
- `diary_assets`：图片等本地资源
- `diary_layouts`：日记布局信息
- `app_settings`：应用设置
- `event_queue`：为后续异步任务预留的事件队列

当前正文以一个 `text` Block 保存。后续图片能力会写入 `image` Block，并将图片复制到 App 私有目录后登记到 `diary_assets`。

## Android 版本

应用包名为 `xyz.shiguangjian.app`，数据库文件为 `shiguangjianSQLite.db`，位于 Android 应用私有目录中。卸载应用或清除应用数据会同时删除本地日记。

目前发布的是调试签名 APK，适合功能体验和开发测试：

- [前往 GitHub Releases](https://github.com/boringHub/diary-app/releases/latest)
- [直接下载最新 APK](https://github.com/boringHub/diary-app/releases/latest/download/shiguangjian-android-debug.apk)

## 当前进度

已经完成：

- 日记核心功能与主要交互动画
- Web LocalStorage 持久化
- Android SQLite 持久化
- Repository 单元测试
- Capacitor Android 工程与 APK 构建
- GitHub Actions 自动测试和生产构建

接下来将继续开发图片选择、私有目录存储、图片内容块渲染、数据导入导出和正式签名版本。

关于这一阶段的数据架构、Android 接入和构建过程，可以继续阅读[《拾光笺开发记录：从交互原型到 Android 本地日记》](/posts/building-shiguangjian-local-first-diary-app/)。
