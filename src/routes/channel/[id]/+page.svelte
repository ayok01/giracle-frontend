<script lang="ts">
  import { page } from "$app/stores";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { channelHistoryStore } from "$lib/store/channelHistory";
  import { onlineUserListStore, userListStore } from "$lib/store/user";
  import {
    formatDate,
    getChannelHistory,
    scrollHandler,
    linkify,
    sendMessage,
  } from "./channelMessage";
  import { onMount } from "svelte";
  import UserProfile from "$lib/components/unique/userProfile.svelte";
  import MessageInput from "./messageInput.svelte";

  onMount(async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await getChannelHistory();
    const MessageContainer = document.getElementById("messageContainer");
    console.log(MessageContainer);
    MessageContainer?.addEventListener("scroll", scrollHandler);
  });

  $: (async () => {
    console.log("/channel/[id] :: $page.params.id->", $page.params.id);
    await getChannelHistory();
  })();
</script>

<div class="h-full w-full flex flex-col px-1 pb-2">
  <div
    id="messageContainer"
    class="flex-grow flex flex-col-reverse overflow-y-auto"
  >
    {#each $channelHistoryStore.history as message, index}
      <div class="flex p-2 items-start mb-4 gap-2 w-full hover:bg-base-300">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="dropdown dropdown-right dropdown-end">
          <div tabindex={index} role="button" class="w-15">
            <div
              class="avatar {$onlineUserListStore.find(
                (v) => v === message.userId,
              ) !== undefined
                ? 'online'
                : 'offline'} "
            >
              <div class="w-8 rounded-full">
                <img src="/api/user/icon/{message.userId}" alt="userIcon" />
              </div>
            </div>
          </div>
          <div
            tabindex={index}
            class="shadow m-0 p-0 card card-compact dropdown-content bg-base-100 rounded-box w-64"
          >
            <UserProfile userId={message.userId} />
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <div class="flex gap-2 items-center">
            <span class="font-bold text-sm">
              {$userListStore.find((user) => user.id === message.userId)?.name}
            </span>

            <span class="text-xs text-gray-500"
              >{formatDate(message.createdAt)}</span
            >
          </div>
          <div class="break-words break-all">
            {@html linkify(message.content)}
          </div>
          {#if message.MessageUrlPreview && message.MessageUrlPreview.length > 0}
            <div class="mt-2 p-2 border rounded-lg">
              {#each message.MessageUrlPreview as preview}
                <div class="md:flex flex-row">
                  <div class="md:ml-4 md:flex-grow md:min-w-0 md:basis-1/2">
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-700 md:flex-shrink-0 break-words break-all"
                    >
                      <img
                        src={preview.faviconLink}
                        alt="Favicon"
                        class="inline w-4 h-4 mr-1"
                      />
                      {preview.title}
                    </a>
                    <div class="md:ml-4 md:flex-grow md:min-w-0 md:max-w-100">
                      <p class="break-words break-all">{preview.description}</p>
                    </div>
                  </div>
                  {#if preview.imageLink}
                    <div
                      class="h-30 sm:h-20 md:h-40 md:w-fit overflow-hidden md:ml-4"
                    >
                      <img
                        src={preview.imageLink}
                        alt={`Preview image for ${preview.title}`}
                        class="mt-2 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="flex gap-1">
    <MessageInput on:sendMessage={sendMessage} />
  </div>
</div>

<style>
  /* サイドバーとかぶってしまうため */
  /* 暫定対応 */
  .avatar.offline:before {
    z-index: 0 !important;
  }
  .avatar.online:before {
    z-index: 0 !important;
  }
</style>
