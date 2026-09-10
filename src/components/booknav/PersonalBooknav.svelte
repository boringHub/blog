<script lang="ts">
	import Icon from "@/components/common/Icon.svelte";
	import type { BooknavItem, PersonalBooknavItem } from "@/types/booknavConfig";
	import {
		createPersonalBooknavItem,
		exportPersonalBooknavItems,
		isValidBooknavUrl,
		loadPersonalBooknavItems,
		parsePersonalBooknavImport,
		savePersonalBooknavItems,
	} from "@/utils/personal-booknav";

	type Props = {
		items: BooknavItem[];
		storageKey: string;
		maxItems: number;
		enableImportExport: boolean;
	};

	const { items: publicItems, storageKey, maxItems, enableImportExport }: Props = $props();
	let personalItems = $state<PersonalBooknavItem[]>([]);
	let activeGroup = $state("all");
	let query = $state("");
	let showEditor = $state(false);
	let editingId = $state<string | null>(null);
	let errorMessage = $state("");

	const filteredPublicItems = $derived(
		publicItems.filter((item) => matchesItem(item.title, item.desc, item.tags)),
	);
	const filteredPersonalItems = $derived(
		personalItems.filter((item) => matchesItem(item.title, item.desc)),
	);

	function matchesItem(...values: (string | string[] | undefined)[]): boolean {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return true;
		return values
			.flatMap((value) => (Array.isArray(value) ? value : [value || ""]))
			.some((value) => value.toLowerCase().includes(normalizedQuery));
	}

	function persist(items: PersonalBooknavItem[]) {
		personalItems = items;
		savePersonalBooknavItems(localStorage, storageKey, items, maxItems);
	}

	function openEditor(id?: string) {
		errorMessage = "";
		editingId = id || null;
		showEditor = true;
	}

	function removeItem(id: string) {
		persist(personalItems.filter((item) => item.id !== id));
	}

	function saveItem(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const data = new FormData(form);
		const title = String(data.get("title") || "").trim();
		const url = String(data.get("url") || "").trim();
		const desc = String(data.get("desc") || "").trim();
		const group = String(data.get("group") || "").trim();
		const icon = String(data.get("icon") || "").trim();

		if (!title || !isValidBooknavUrl(url)) {
			errorMessage = "请输入名称和有效的 http(s) 地址。";
			return;
		}
		if (personalItems.some((item) => item.url.toLowerCase() === url.toLowerCase() && item.id !== editingId)) {
			errorMessage = "这个网址已经存在。";
			return;
		}

		if (editingId) {
			persist(
				personalItems.map((item) =>
					item.id === editingId
						? { ...item, title, url, desc: desc || undefined, group: group || undefined, icon: icon || undefined, updatedAt: Date.now() }
						: item,
				),
			);
		} else if (personalItems.length < maxItems) {
			persist([...personalItems, createPersonalBooknavItem({ title, url, desc, group, icon })]);
		} else {
			errorMessage = `最多保存 ${maxItems} 个快捷入口。`;
			return;
		}

		showEditor = false;
	}

	function addPublicItem(item: BooknavItem) {
		if (personalItems.some((saved) => saved.url.toLowerCase() === item.url.toLowerCase())) return;
		if (personalItems.length >= maxItems) {
			errorMessage = `最多保存 ${maxItems} 个快捷入口。`;
			return;
		}
		persist([
			...personalItems,
			createPersonalBooknavItem({
				title: item.title,
				url: item.url,
				desc: item.desc,
				icon: item.icon,
				group: "我的常用",
			}),
		]);
	}

	function isSaved(item: BooknavItem) {
		return personalItems.some((saved) => saved.url.toLowerCase() === item.url.toLowerCase());
	}

	function exportItems() {
		const blob = new Blob([exportPersonalBooknavItems(personalItems)], { type: "application/json" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "booknav-bookmarks.json";
		link.click();
		URL.revokeObjectURL(link.href);
	}

	function importItems(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const imported = parsePersonalBooknavImport(String(reader.result || ""), maxItems);
			if (!imported) {
				errorMessage = "导入失败：文件格式或网址无效。";
				return;
			}
			persist(imported);
			errorMessage = "";
		};
		reader.readAsText(file);
		input.value = "";
	}

	$effect(() => {
		personalItems = loadPersonalBooknavItems(localStorage, storageKey);
	});
</script>

<section class="mb-8" aria-labelledby="personal-booknav-title">
  <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
    <div>
      <h2 id="personal-booknav-title" class="text-lg font-bold text-neutral-900 dark:text-neutral-100">我的快捷访问</h2>
      <p class="text-sm text-neutral-500 dark:text-neutral-400">保存在当前浏览器中的常用网站</p>
    </div>
    <div class="flex flex-wrap gap-2">
      {#if enableImportExport}
        <button class="booknav-action" type="button" onclick={exportItems} title="导出收藏">
          <Icon icon="material-symbols:download-rounded" /> 导出
        </button>
        <label class="booknav-action cursor-pointer" title="导入收藏">
          <Icon icon="material-symbols:upload-rounded" /> 导入
          <input class="hidden" type="file" accept="application/json,.json" onchange={importItems} />
        </label>
      {/if}
      <button class="booknav-action booknav-action-primary" type="button" onclick={() => openEditor()}>
        <Icon icon="material-symbols:add-rounded" /> 添加
      </button>
    </div>
  </div>

  {#if errorMessage}
    <p class="mb-3 text-sm text-red-600 dark:text-red-400" role="alert">{errorMessage}</p>
  {/if}

  <div class="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="工具箱分类">
    <button class:booknav-tab-active={activeGroup === "all"} class="booknav-tab" type="button" onclick={() => (activeGroup = "all")}>全部</button>
    <button class:booknav-tab-active={activeGroup === "personal"} class="booknav-tab" type="button" onclick={() => (activeGroup = "personal")}>我的常用 ({personalItems.length})</button>
    {#each [...new Set(publicItems.flatMap((item) => item.tags || []))] as tag}
      <button class:booknav-tab-active={activeGroup === tag} class="booknav-tab" type="button" onclick={() => (activeGroup = tag)}>{tag}</button>
    {/each}
  </div>

  <div class="relative mb-4">
    <Icon icon="material-symbols:search-rounded" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
    <input bind:value={query} class="w-full rounded-xl border border-(--line-divider) bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-(--primary)" placeholder="搜索快捷访问" type="search" />
  </div>

  {#if activeGroup === "personal" || activeGroup === "all"}
    <div class="booknav-personal-grid">
      {#each filteredPersonalItems as item (item.id)}
        <article class="booknav-personal-card">
          <a href={item.url} target="_blank" rel="noopener noreferrer" class="min-w-0 flex-1">
            <strong class="block truncate text-neutral-900 dark:text-neutral-100">{item.title}</strong>
            <span class="block truncate text-xs text-neutral-500 dark:text-neutral-400">{item.desc || item.url}</span>
          </a>
          <div class="flex shrink-0 gap-1">
            <button class="booknav-icon-button" type="button" title="编辑" onclick={() => openEditor(item.id)}><Icon icon="material-symbols:edit-outline-rounded" /></button>
            <button class="booknav-icon-button" type="button" title="删除" onclick={() => removeItem(item.id)}><Icon icon="material-symbols:delete-outline-rounded" /></button>
          </div>
        </article>
      {:else}
        <p class="text-sm text-neutral-500 dark:text-neutral-400">还没有快捷访问，点击“添加”创建一个。</p>
      {/each}
    </div>
  {/if}

  {#if showEditor}
    {@const editing = personalItems.find((item) => item.id === editingId)}
    <div class="booknav-editor-backdrop" role="presentation" onclick={(event) => event.target === event.currentTarget && (showEditor = false)}>
      <form class="booknav-editor" onsubmit={saveItem}>
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="text-lg font-bold">{editing ? "编辑快捷访问" : "添加快捷访问"}</h3>
          <button class="booknav-icon-button" type="button" title="关闭" onclick={() => (showEditor = false)}><Icon icon="material-symbols:close-rounded" /></button>
        </div>
        <label>名称<input name="title" required value={editing?.title || ""} /></label>
        <label>网址<input name="url" required type="url" placeholder="https://example.com" value={editing?.url || ""} /></label>
        <label>描述<input name="desc" value={editing?.desc || ""} /></label>
        <label>分组<input name="group" value={editing?.group || ""} placeholder="例如：开发" /></label>
        <label>图标地址<input name="icon" value={editing?.icon || ""} placeholder="可选" /></label>
        {#if errorMessage}<p class="text-sm text-red-600 dark:text-red-400" role="alert">{errorMessage}</p>{/if}
        <button class="booknav-action booknav-action-primary mt-2 justify-center" type="submit">保存</button>
      </form>
    </div>
  {/if}
</section>

<style>
	.booknav-action, .booknav-tab, .booknav-icon-button { display: inline-flex; align-items: center; gap: 0.35rem; border: 1px solid var(--line-divider); border-radius: 0.65rem; padding: 0.45rem 0.7rem; color: var(--btn-content); background: var(--btn-regular-bg); transition: all 0.2s ease; }
	.booknav-action:hover, .booknav-tab:hover, .booknav-icon-button:hover { border-color: var(--primary); color: var(--primary); }
	.booknav-action-primary, .booknav-tab-active { background: var(--primary); color: white; border-color: var(--primary); }
	.booknav-personal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; }
	.booknav-personal-card { display: flex; align-items: center; gap: 0.75rem; min-width: 0; padding: 0.8rem; border: 1px solid var(--line-divider); border-radius: 0.75rem; }
	.booknav-personal-card:hover { border-color: var(--primary); }
	.booknav-editor-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 1rem; background: rgb(0 0 0 / 0.45); }
	.booknav-editor { width: min(100%, 28rem); display: grid; gap: 0.8rem; padding: 1.25rem; border-radius: 1rem; background: var(--card-bg); box-shadow: 0 1rem 3rem rgb(0 0 0 / 0.2); }
	.booknav-editor label { display: grid; gap: 0.35rem; font-size: 0.85rem; color: var(--btn-content); }
	.booknav-editor input { width: 100%; border: 1px solid var(--line-divider); border-radius: 0.6rem; padding: 0.6rem 0.7rem; background: transparent; color: inherit; outline: none; }
	.booknav-editor input:focus { border-color: var(--primary); }
</style>
