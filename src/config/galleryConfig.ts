import type { GalleryConfig } from "@/types/galleryConfig";

// 相册配置
export const galleryConfig: GalleryConfig = {
	// 相册列表
	albums: [
		{
			id: "my-album-2026",
			name: "我的相册",
			description: "记录生活中的美好瞬间",
			location: "暂无",
			date: "2026-09-09",
			tags: ["生活"],
		},
	],

	// 瀑布流最小列宽(px)，浏览器根据容器宽度自动计算列数
	columnWidth: 240,
};
