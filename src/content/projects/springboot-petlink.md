---
title: SpringBoot PetLink
published: 2026-09-09
description: 综合性的宠物社交平台，提供宠物档案、内容分享、互动交流和宠物匹配服务。
image: ""
tags: [Spring Boot, Vue 3, MySQL, Redis, 宠物社交]
link:
  - label: Gitee
    icon: fa7-brands:gitee
    value: https://gitee.com/springboot-petlink
status: 已结束
lang: zh_CN
---

## 项目简介

PetLink 是一个综合性的宠物社交平台，旨在为宠物主人提供交流、分享和宠物匹配的在线社区。平台由后台管理系统、移动端应用和后端服务组成，采用前后端分离架构，兼顾用户体验和系统可扩展性。

## 技术栈

### 后台管理系统 `petlink-admin-vue`

- Vue 3 + Vite
- Element Plus
- Pinia
- Vue Router
- Axios
- ECharts

### 移动端应用 `petlink-app-vue`

- Vue 3 + Vite
- Vant UI
- Pinia
- Vue Router
- Axios

### 后端服务 `petlink-java`

- Spring Boot 3
- MyBatis Plus
- MySQL
- Redis
- MinIO
- JWT
- WebSocket
- Knife4j

## 核心功能

- 用户注册、登录和个人信息管理
- 宠物档案、宠物相册和健康状况记录
- 宠物交友与配种意向设置
- 帖子发布、图片/视频分享、点赞、评论和话题标签
- 实时消息推送
- 基于宠物信息和意向的宠物匹配
- 后台用户、宠物和帖子审核
- 角色权限管理
- 数据统计和可视化

## 项目结构

```text
petlink-admin-vue/  # 后台管理系统
petlink-app-vue/    # 移动端应用
petlink-java/       # 后端服务
├── common/         # 公共模块
├── model/          # 数据模型
└── web/            # Web 服务
    ├── web-admin/  # 后台管理 API
    └── web-app/    # 移动端 API
```

## 业务流程

1. 用户通过移动端注册并登录。
2. 创建宠物档案，上传宠物信息和照片，设置交友或配种意向。
3. 发布宠物日常和养宠心得，添加话题标签。
4. 浏览、点赞和评论其他用户的帖子。
5. 根据宠物信息和意向寻找合适的匹配对象。
6. 由管理员审核用户、宠物和帖子内容，维护平台质量。

## 项目特色

- 完整的前后端分离架构
- 同时支持后台管理系统和移动端应用
- 丰富的宠物社交和互动功能
- 基于宠物信息和用户意向的匹配推荐
- 完善的角色权限管理
- 使用 MinIO 对象存储和 Redis 缓存优化系统性能

## 应用场景

- 宠物主人分享宠物日常，记录宠物成长
- 寻找宠物玩伴或配种对象
- 交流养宠经验和心得
- 宠物相关商家推广产品和服务
- 管理员审核和管理平台内容

PetLink 致力于打造一个温暖、活跃的宠物社交社区，为宠物主人提供全方位的服务和支持。
