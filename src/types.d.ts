declare type Type = "message" | "image";

declare interface MessageProps {
  type: Type;
  userName: string;
  message: string;
}

declare class ChatRoom extends WebSocket {
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView | MessageProps): void;
}

declare class Compress {
  compress(files: File[], options: {
    size: number,
    quality: number,
  }): Promise<{ data: string; prefix: string }[]> { }
}