export type NavBarMegaMenuGroup = {
	name: string;
	icon?: string;
	items: NavBarLink[];
};

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: NavBarLink[]; // 支持子菜单
	megaMenu?: NavBarMegaMenuGroup[]; // 宽面板分组菜单
	pageKey?: string;
};

export enum NavBarSearchMethod {
	PageFind = 0,
}

export type NavBarSearchConfig = {
	method: NavBarSearchMethod;
};

export type NavBarConfig = {
	links: NavBarLink[];
};
