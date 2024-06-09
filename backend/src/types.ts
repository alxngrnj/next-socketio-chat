export type SocketData = {
  name: string;
  socketId: string;
};

export type SocketPrivateMessage = {
  from: string;
  name: string;
  to: string;
  message: string;
  timestamp: number;
};

export interface ServerToClientEvents {
  broadcast: (broadcastMessage: string) => void;
  update: (newOnlineUserData: SocketData) => void;
  online_user: (onlineUsers: Record<string, string>) => void;
  private_message: (privateMessage: SocketPrivateMessage) => void;
}

export interface ClientToServerEvents {
  broadcast: (
    broadcastMessage: string,
    callback: (response: { ok: boolean }) => void,
  ) => void;
  update: (
    newOnlineUserData: SocketData,
    callback: (response: { ok: boolean }) => void,
  ) => void;
  join: (newOnlineUser: SocketData) => void;
  private_message: (
    privateMessage: SocketPrivateMessage,
    callback: (response: { ok: boolean }) => void,
  ) => void;
  disconnect: () => void;
}
