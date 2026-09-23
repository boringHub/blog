---
title: 拾光笺开发记录：从交互原型到 Android 本地日记
published: 2026-09-23
description: 记录拾光笺从记忆星球交互原型走向 Android App 的过程，以及异步 Repository、SQLite 表结构和 Capacitor 接入中的关键取舍。
image: /assets/images/projects/shiguangjian-memory-planet.png
tags: [Vue, Ionic, Capacitor, SQLite, Android, 本地优先]
category: 技术
draft: false
pinned: false
comment: true
---

## 从“日记列表”换成“记忆星球”

拾光笺最初想解决的并不是“如何再做一个日记编辑器”，而是日记写完之后如何被重新看见。

传统时间线擅长排序，却很容易让旧记录一路沉到底部。我最后选择把每篇日记变成一颗星，用 Canvas 绘制一个可以拖动和聚焦的记忆星球。星体颜色代表记录时的心情，收藏的日记带有额外光环；写完新日记后，它会以一颗新星坠入星球。

这个阶段主要解决了体验问题：

- 星球旋转、透视投影和自动缓动
- 点击、拖动与聚焦状态之间的协调
- 日期搜索和同日记录聚类
- 编辑页进入、保存和返回星球的过渡动画
- 日记详情、收藏与删除流程

交互基本稳定后，下一步不再是继续堆动画，而是让数据真正可靠地留在设备上。

## 为什么先抽象 Repository

早期版本直接使用 `localStorage`，调用方式是同步的：

```typescript
const diaries = diaryRepository.list();
const diary = diaryRepository.save(input);
```

这对浏览器原型足够简单，但 Android 上的 SQLite 查询天然是异步的。如果直接在页面中判断平台并调用不同 API，页面和 Store 会很快被平台细节占满。

因此我先把存储契约统一改为异步接口：

```typescript
export interface DiaryRepository {
  list(): Promise<Diary[]>;
  get(id: string): Promise<Diary | undefined>;
  save(input: SaveDiaryInput): Promise<Diary>;
  toggleFavorite(id: string): Promise<void>;
  remove(id: string): Promise<void>;
}
```

平台选择只发生在 Repository 入口：

```typescript
function resolveRepository(): Promise<DiaryRepository> {
  repositoryPromise ??= Capacitor.isNativePlatform()
    ? import("./sqliteDiaryRepository").then(
        ({ SQLiteDiaryRepository }) => new SQLiteDiaryRepository(),
      )
    : Promise.resolve(
        new LocalStorageDiaryRepository(() => window.localStorage),
      );

  return repositoryPromise;
}
```

这里使用动态导入还有一个额外好处：浏览器入口包不需要提前加载 SQLite 实现，原生依赖被留在真正需要它的平台路径中。

## Store 如何适配异步存储

Repository 异步化后，Pinia Store 也需要处理几个之前不存在的状态：

- 首次读取时的 `loading`
- 保存过程中的 `saving`
- 多个页面同时调用初始化时的重复加载
- 原生数据库失败时的错误反馈

为了避免重复查询，我保留了同一个初始化 Promise：

```typescript
let loadPromise: Promise<void> | undefined;

function ensureLoaded() {
  if (loaded.value) return Promise.resolve();
  loadPromise ??= refresh().finally(() => {
    loadPromise = undefined;
  });
  return loadPromise;
}
```

页面不再假设数据已经同步到内存。详情页增加加载状态，编辑页等待已有日记读取完成再填充表单，保存按钮在写入过程中禁用，并在失败时显示 Toast。

## SQLite V1 为什么采用内容块结构

即使当前编辑器只有标题、正文和心情，我也没有把所有内容都塞进 `diaries` 表。原因是下一阶段已经明确需要图片，而日记内容以后还可能出现位置、分隔符、引用或不同布局。

当前数据库的核心关系是：

```text
diaries
  ├── diary_blocks
  ├── diary_assets
  └── diary_layouts
```

其中：

- `diaries` 保存标题、摘要、时间、心情、收藏和主题等元数据
- `diary_blocks` 保存有顺序的内容块，当前正文是一条 `text` Block
- `diary_assets` 记录图片等资源在应用私有目录中的路径和尺寸
- `diary_layouts` 为后续不同排版方案保留独立数据

另外还有 `app_settings` 和 `event_queue`。后者目前没有业务逻辑，但可以在未来承接导出、备份或其他需要重试的异步任务。

数据库通过 `PRAGMA user_version = 1` 标记版本，后续结构变化可以据此执行迁移，而不需要在升级时删除用户数据。

## Capacitor 与 Android 接入

原生层使用 Capacitor 8，并接入 SQLite 和 Filesystem 插件。应用包名最终确定为：

```text
xyz.shiguangjian.app
```

最初设想的包名中有一段以数字开头，但 Java 包名的每个分段都必须是合法标识符，因此需要调整。

另一个实际问题来自 Windows 工作区路径。项目所在目录包含中文，Android Gradle Plugin 会触发路径检查，所以在 `android/gradle.properties` 中启用了：

```properties
android.overridePathCheck=true
```

这并不影响 APK 运行，只是为了让当前本地路径能够完成构建。更通用的做法仍然是把 Android 项目放在纯 ASCII 路径中。

## 首次启动与软删除

第一次打开 App 时，数据库会初始化默认布局和欢迎日记，让空白状态也能说明产品的使用方式。

删除操作则采用软删除：

```sql
UPDATE diaries
SET is_deleted = 1, updated_at = ?
WHERE id = ?;
```

正常时间线只查询 `is_deleted = 0` 的记录。这为后续增加回收站或误删恢复留下了空间，也避免在删除日记时立即破坏相关内容块和资源关系。

## 如何验证这一阶段

这次不只验证了页面能否打开，而是完整走了一遍存储闭环：

1. 在浏览器中创建日记并保存。
2. 返回星球确认新星入场动画。
3. 打开详情并切换收藏状态。
4. 刷新页面，确认记录和收藏状态仍然存在。
5. 运行 Repository 单元测试。
6. 执行 Web 生产构建和 Capacitor 同步。
7. 使用 Gradle 构建 Android Debug APK。

当前测试、Web 构建、Android 构建和 GitHub Actions CI 都已经通过。APK 已作为 GitHub Release 附件发布，不过由于当时没有连接 Android 设备，真机安装和不同系统版本的兼容性仍需要继续验证。

## 下一阶段

下一步将进入图片日记能力：

1. 选择相册图片。
2. 使用 Filesystem 将图片复制到 App 私有目录。
3. 在 `diary_assets` 中保存资源信息。
4. 在 `diary_blocks` 中写入 `image` Block。
5. 在编辑器和详情页按顺序渲染文本与图片。

这也是前面提前拆分内容块和资源表的原因：下一阶段应该是沿着现有结构增加能力，而不是推翻当前的数据模型。

## 小结

这次开发最重要的变化，不是“加了 SQLite”，而是把一个交互原型变成了具备平台边界和数据演进空间的 App 基础。

先统一异步存储契约，再接入原生数据库；先确定内容块模型，再开发图片功能。这样的顺序让页面层保持简单，也让后续功能不必围绕早期的同步 LocalStorage 设计反复修改。

- [项目源码](https://github.com/boringHub/diary-app)
- [博客项目页](/projects/shiguangjian-diary-app/)
- [Android 开发预览版](https://github.com/boringHub/diary-app/releases/latest)
