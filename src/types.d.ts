declare type Type = "message" | "image" | "bigImage" | "emoti";

declare interface MessageProps {
  type: Type;
  message: string;
  userName: string;
}

declare class ChatRoom extends WebSocket {
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView | MessageProps): void;
}

declare class Compress {
  compress(
    files: File[],
    options: {
      size: number;
      quality: number;
    }
  ): Promise<{ data: string; prefix: string }[]> {}
}
