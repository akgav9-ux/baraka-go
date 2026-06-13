import { WebSocketServer } from "ws";
import { wsStore } from "./ws-store";

let wss: WebSocketServer;
const clients = new Set<any>();

export function initWebSocket(server: any) {
  if (wss) return wss;

  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  // 🔥 attach broadcast globally
  wsStore.broadcast = (data: any) => {
    clients.forEach((ws) => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    });
  };

  return wss;
}