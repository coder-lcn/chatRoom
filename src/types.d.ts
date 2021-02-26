declare type Type = "message" | "image";

declare interface MessageProps {
  type: Type;
  userName: string;
  message: string;
}

declare class ChatRoom extends WebSocket {
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView | MessageProps): void;
}
