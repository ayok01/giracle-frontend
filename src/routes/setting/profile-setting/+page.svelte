<script lang="ts">
  import { myUserStore } from "$lib/store/user";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { goto } from "$app/navigation";
  import { IconSettings } from "@tabler/icons-svelte";

  const userRepository = repositoryFactory.get("user");

  let iconObj: File | null = null;
  let name = "";
  let selfIntroduction = "";
  let processing = false;

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
  });

  myUserStore.subscribe((value) => {
    name = value.name;
    selfIntroduction = value.selfIntroduction;
  });
</script>

<div>
  <div class="w-full h-10 flex gap-2 items-center">
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
  <div class="w-full my-14">
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
    </div>
  </div>
</div>
