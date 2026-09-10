import type {
	PersonalBooknavItem,
	PersonalBooknavStore,
} from "../types/booknavConfig";

export const PERSONAL_BOOKNAV_VERSION = 1 as const;

export function isValidBooknavUrl(url: string): boolean {
	try {
		const parsed = new URL(url.trim());
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export function normalizeBooknavUrl(url: string): string {
	return url.trim();
}

export function createPersonalBooknavItem(input: {
	title: string;
	url: string;
	desc?: string;
	icon?: string;
	group?: string;
}): PersonalBooknavItem {
	const now = Date.now();

	return {
		id: createBooknavId(),
		title: input.title.trim(),
		url: normalizeBooknavUrl(input.url),
		desc: input.desc?.trim() || undefined,
		icon: input.icon?.trim() || undefined,
		group: input.group?.trim() || undefined,
		createdAt: now,
		updatedAt: now,
	};
}

export function loadPersonalBooknavItems(
	storage: Storage,
	storageKey: string,
): PersonalBooknavItem[] {
	try {
		const raw = storage.getItem(storageKey);
		if (!raw) return [];

		const parsed = JSON.parse(raw) as Partial<PersonalBooknavStore>;
		if (parsed.version !== PERSONAL_BOOKNAV_VERSION || !Array.isArray(parsed.items)) {
			return [];
		}

		return parsed.items.filter(isPersonalBooknavItem);
	} catch {
		return [];
	}
}

export function savePersonalBooknavItems(
	storage: Storage,
	storageKey: string,
	items: PersonalBooknavItem[],
	maxItems: number,
): boolean {
	try {
		const store: PersonalBooknavStore = {
			version: PERSONAL_BOOKNAV_VERSION,
			items: dedupePersonalBooknavItems(items).slice(0, maxItems),
		};
		storage.setItem(storageKey, JSON.stringify(store));
		return true;
	} catch {
		return false;
	}
}

export function exportPersonalBooknavItems(
	items: PersonalBooknavItem[],
): string {
	return JSON.stringify(
		{
			version: PERSONAL_BOOKNAV_VERSION,
			exportedAt: new Date().toISOString(),
			items: dedupePersonalBooknavItems(items),
		},
		null,
		2,
	);
}

export function parsePersonalBooknavImport(
	text: string,
	maxItems: number,
): PersonalBooknavItem[] | null {
	try {
		const parsed = JSON.parse(text) as Partial<PersonalBooknavStore>;
		if (parsed.version !== PERSONAL_BOOKNAV_VERSION || !Array.isArray(parsed.items)) {
			return null;
		}

		return dedupePersonalBooknavItems(parsed.items.filter(isPersonalBooknavItem)).slice(
			0,
			maxItems,
		);
	} catch {
		return null;
	}
}

function isPersonalBooknavItem(value: unknown): value is PersonalBooknavItem {
	if (!value || typeof value !== "object") return false;

	const item = value as Partial<PersonalBooknavItem>;
	return (
		typeof item.id === "string" &&
		typeof item.title === "string" &&
		item.title.trim().length > 0 &&
		typeof item.url === "string" &&
		isValidBooknavUrl(item.url) &&
		typeof item.createdAt === "number" &&
		typeof item.updatedAt === "number"
	);
}

function dedupePersonalBooknavItems(items: PersonalBooknavItem[]): PersonalBooknavItem[] {
	const seen = new Set<string>();
	return items.filter((item) => {
		const key = normalizeBooknavUrl(item.url).toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

function createBooknavId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `bookmark-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
