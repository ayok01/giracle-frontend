export let ws: WebSocket;

//WS接続がエラーで閉じられた場合のフラグ
let FLAGwsError = false;

export const initWS = () => {
  //WebSocketの接続確率
  ws = new WebSocket("/ws");

  ws.onopen = (event) => {
    //テスト
    ws.send(JSON.stringify({
      signal: "ping",
      data: null
    }));
    console.log("INIT.ws :: initWS : open->", event);
  }

  ws.onerror = (event) => {
    console.log("INIT.ws :: initWS : error->", event);
  }

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data);
    console.log("INIT.ws :: initWS : event->", json);

    //トークンが無効な場合のフラグ設定
    if (json.signal === "ERROR" && json.data === "token not valid") {
      FLAGwsError = true;
    }
  }

  ws.onclose = (event) => {
    console.log("INIT.ws :: initWS : close->", event);

    //エラーで閉じられた場合は再接続しない
    if (FLAGwsError) return;

    //再接続
    setTimeout(() => {
      initWS();
    }, Math.random() * 500 + 1000);
  }
};