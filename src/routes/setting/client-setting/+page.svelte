<script lang="ts">
  import type { Theme } from "daisyui";
  import { themaStore } from "$lib/store/thema";
  import { changeThema } from "$lib/utils/thema";
  import { goto } from "$app/navigation";
  import { IconSettings } from "@tabler/icons-svelte";

  const lightThemes: Theme[] = [
    "light",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "pastel",
    "fantasy",
    "wireframe",
    "luxury",
    "autumn",
    "lemonade",
    "winter",
    "sunset",
    "dark",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "black",
    "dracula",
    "cmyk",
    "business",
    "acid",
    "night",
    "coffee",
    "dim",
    "nord",
  ];
  const darkThemes: Theme[] = [
    "dark",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "black",
    "dracula",
    "cmyk",
    "business",
    "acid",
    "night",
    "coffee",
    "dim",
    "nord",
    "light",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "pastel",
    "fantasy",
    "wireframe",
    "luxury",
    "autumn",
    "lemonade",
    "winter",
    "sunset",
  ];

  let selectedLightTheme: Theme = $themaStore.lightTheme;
  let selectedDarkTheme: Theme = $themaStore.darkTheme;

  themaStore.subscribe((value) => {
    selectedLightTheme = value.lightTheme;
    selectedDarkTheme = value.darkTheme;
  });

  const handleLightThemeChange = async (theme: Theme) => {
    selectedLightTheme = theme;
    localStorage.setItem("lightTheme", theme);
    await themaStore.update((t) => {
      t.lightTheme = theme;
      return t;
    });
    await changeThema();
    // ローカルストレージに保存
    localStorage.setItem("lightTheme", theme);
  };

  const handleDarkThemeChange = async (theme: Theme) => {
    selectedDarkTheme = theme;
    localStorage.setItem("darkTheme", theme);
    await themaStore.update((t) => {
      t.darkTheme = theme;
      return t;
    });
    await changeThema();
    // ローカルストレージに保存
    localStorage.setItem("darkTheme", theme);
  };
</script>

<div class="w-full h-10 flex gap-2 items-center">
  <button
    class="btn btn-ghost"
    on:click={() => {
      goto("/setting");
    }}
  >
    <IconSettings size={20} />
  </button>
  <h1 class="text-2xl font-bold">クライアント設定</h1>
</div>
<div>
  <label>ライトテーマ</label>
  <select
    bind:value={selectedLightTheme}
    on:change={() => handleLightThemeChange(selectedLightTheme)}
  >
    {#each lightThemes as theme}
      <option value={theme}>{theme}</option>
    {/each}
  </select>

  <label>ダークテーマ</label>
  <select
    bind:value={selectedDarkTheme}
    on:change={() => handleDarkThemeChange(selectedDarkTheme)}
  >
    {#each darkThemes as theme}
      <option value={theme}>{theme}</option>
    {/each}
  </select>
</div>
{$themaStore.darkTheme}
