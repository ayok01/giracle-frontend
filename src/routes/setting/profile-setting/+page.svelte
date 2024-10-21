<script lang="ts">
  import { myUserStore } from "$lib/store/user";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { goto } from "$app/navigation";
  import { IconSettings } from "@tabler/icons-svelte";
  import type { Theme } from "daisyui";
  import { changeThema } from "$lib/utils/thema";
  import { themaStore } from "$lib/store/thema";
  import { sineInOut } from "svelte/easing";
  import { toastStore } from "$lib/store/toast";
  import Password from "@tabler/icons-svelte/icons/password";
  const userRepository = repositoryFactory.get("user");

  let iconObj: File | null = null;
  let name = "";
  let selfIntroduction = "";
  let processing = false;

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

  let my_modal_5: HTMLDialogElement;

  let incorrectCurrentPassword: boolean = false;
  let isCorrectNewPassword: boolean = false;
  let currentPassword: string = "";
  let newPassword: string = "";
  let newPasswordConfirm: string = "";
  $: isCorrectNewPassword = newPassword == newPasswordConfirm;

  const closePasswordModal = () => {
    incorrectCurrentPassword = false;
    newPassword = "";
    newPasswordConfirm = "";
    currentPassword = "";
  };

  const changePassword = async () => {
    console.log("PasswordChanged");
    await userRepository
      .changePassword(currentPassword, newPassword)
      .then((response) => {
        console.log("パスワード変更成功", response);
        my_modal_5.close();
        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "パスワードを変更しました。",
              type: "success",
            },
          ];
        });
      })
      .catch((response) => {
        console.log("パスワード変更失敗", response);
        //現在のパスワードが一致しているか
        incorrectCurrentPassword = response.message == "401";

        toastStore.update((toast) => {
          return [
            ...toast,
            {
              message: "パスワードの変更に失敗しました。",
              type: "success",
            },
          ];
        });
      });
  };

  let selectedLightTheme: Theme = $themaStore.lightTheme;
  let selectedDarkTheme: Theme = $themaStore.darkTheme;

  themaStore.subscribe((value) => {
    selectedLightTheme = value.lightTheme;
    selectedDarkTheme = value.darkTheme;
  });

  //ユーザー情報を更新させる
  const updateIt = async () => {
    //処理中フラグを立てる
    processing = true;
    //情報更新と取得
    const newUserinfo = await userRepository.updateProfile(
      name,
      selfIntroduction,
    );
    //console.log("/user/[id] :: updateIt : newUserinfo->", newUserinfo);

    //自分情報用のStoreへ格納
    myUserStore.update((user) => {
      return {
        ...user,
        name: newUserinfo.data.name,
        selfIntroduction: newUserinfo.data.selfIntroduction,
      };
    });
    //処理中フラグを下げる
    processing = false;
  };

  const changeProfileIcon = () => {
    if (iconObj !== null)
      userRepository.changeIcon(iconObj).then((response) => {
        console.log(
          "/user/[id] :: changeProfileIcon : アイコン変更に成功しました！",
          response,
        );
      });
  };

  //画像ファイル受け取り
  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // ファイル処理をここに追加
      iconObj = file;
    }
  };

  const changeProfileBanner = () => {
    if (iconObj !== null)
      userRepository.changeBanner(iconObj).then((response) => {
        console.log(
          "/user/[id] :: changeProfileHeader : ヘッダ画像変更に成功しました！",
          response,
        );
      });
  };

  // ヘッダ画像のファイル受け取り
  const handleBannerFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // ファイル処理をここに追加
      iconObj = file;
    }
  };

  onMount(() => {
    //編集用にユーザー情報を取得
    selfIntroduction = get(myUserStore).selfIntroduction;
    name = get(myUserStore).name;
    //パスワード変更用のモーダルを取得
    my_modal_5 = document.getElementById("my_modal_5") as HTMLDialogElement;
  });

  myUserStore.subscribe((value) => {
    name = value.name;
    selfIntroduction = value.selfIntroduction;
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

<dialog
  id="my_modal_5"
  class="modal modal-bottom sm:modal-middle"
  on:close={closePasswordModal}
>
  <div class="modal-box">
    <h3 class="text-lg font-bold">パスワードの変更</h3>
    <div class="flex flex-col gap-5 my-5">
      <div class="flex flex-col gap-y-2">
        {#if !incorrectCurrentPassword}
          <p>現在のパスワード</p>
        {:else}
          <p class="text-error">
            現在のパスワード - パスワードが間違っています！
          </p>
        {/if}
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            id="currentPasswordField"
            bind:value={currentPassword}
            type="password"
            class="grow"
          />
        </label>
      </div>
      <div class="flex flex-col gap-y-2">
        <p>新しいパスワード</p>
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input bind:value={newPassword} type="password" class="grow" />
        </label>
      </div>
      <div class="flex flex-col gap-y-2">
        {#if (isCorrectNewPassword && newPassword.length > 0) || (newPassword.length == 0 && newPasswordConfirm.length == 0)}
          <p>新しいパスワードを確認</p>
        {:else}
          <p class="text-error">
            新しいパスワードを確認 - パスワードが一致しません！
          </p>
        {/if}
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input bind:value={newPasswordConfirm} type="password" class="grow" />
        </label>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">キャンセル</button>
      </form>
      <button
        class="btn btn-primary {isCorrectNewPassword && newPassword.length > 0
          ? ''
          : 'btn-disabled'}"
        on:click={changePassword}>完了</button
      >
    </div>
  </div>
</dialog>

<div class="w-full">
  <div class="h-10 flex gap-2 items-center">
    <button
      class="btn btn-ghost"
      on:click={() => {
        goto("/setting");
      }}
    >
      <IconSettings size={20} />
    </button>
    <h1 class="text-2xl font-bold">ユーザー</h1>
  </div>
  <hr />
  <div class="my-14">
    <div class="flex justify-center mx-auto gap-x-10 flex-wrap-reverse">
      <div class="flex flex-auto flex-col gap-y-5 my-5 max-w-[350px]">
        <p>名前</p>
        <input
          bind:value={name}
          type="text"
          placeholder="あなたの名前"
          class="input input-bordered w-full"
        />
        <p>自己紹介文</p>
        <div class="card-body px-0 py-0 flex-none">
          <textarea
            bind:value={selfIntroduction}
            class="textarea card bg-base-200"
            placeholder="自己紹介文"
          ></textarea>
        </div>
        <p>id: {$myUserStore.id}</p>
        <p>ロール</p>
        <div class="card bg-base-200">
          <div class="flex flex-row justify-center card-body p-2">
            {#each $myUserStore.RoleLink as role}
              <div class="badge badge-neutral">{role.roleId}</div>
            {/each}
          </div>
        </div>
        <button class="btn btn-warning" on:click={() => my_modal_5.showModal()}>
          パスワードを変更する</button
        >
        <button
          on:click={async () => {
            await userRepository
              .signOut()
              .then((response) => {
                console.log("ログアウトしました。", response);
                location.reload();
              })
              .catch((error) => {
                console.log("ログアウトに失敗しました。", error);
              });
            // リロード
          }}
          class="btn btn-error"
        >
          ログアウト
        </button>
      </div>
      <div class="flex flex-col gap-2 my-5">
        <div class="card bg-base-200 max-w-[350px] mx-auto m-2">
          <div class="card-body">
            <p>アバター</p>
            <div class="avatar mx-auto">
              <div class="w-24 rounded-xl">
                <img src={`/api/user/icon/${$myUserStore.id}`} alt="icon" />
              </div>
            </div>
            <input
              on:change={handleFileChange}
              type="file"
              class="file-input file-input-bordered w-full"
            />
            <div class="card-actions justify-end">
              <button on:click={changeProfileIcon} class="btn btn-primary"
                >アップロード</button
              >
            </div>
          </div>
        </div>

        <div class="card bg-base-200 max-w-[350px] mx-auto m-2">
          <div class="card-body">
            <p>バナー</p>
            <div class="mx-auto">
              <div class="">
                <img
                  src={`/api/user/banner/${$myUserStore.id}`}
                  alt="banner"
                  class="object-cover h-32 w-full rounded-xl"
                />
              </div>
            </div>
            <input
              on:change={handleBannerFileChange}
              type="file"
              class="file-input file-input-bordered w-full"
            />
            <div class="card-actions justify-end">
              <button on:click={changeProfileBanner} class="btn btn-primary"
                >アップロード</button
              >
            </div>
          </div>
        </div>
      </div>
      <!--  Thema設定 -->
      <!--
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

      <button
        on:click={updateIt}
        class="btn"
        disabled={(selfIntroduction === get(myUserStore).selfIntroduction &&
          name === get(myUserStore).name) ||
          name === "" ||
          selfIntroduction === "" ||
          processing}
      >
        {processing ? "処理中..." : "更新"}
      </button>
        -->
    </div>
  </div>
</div>
