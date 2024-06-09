import { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Socket } from "socket.io-client";

// Static types for local interface composition
type TargetSocket = string | undefined;
type Theme = "light" | "dark";
type EmitModeDataTypes = {
  broadcast: SocketBroadcastMessage;
  private_message: SocketPrivateMessage;
  join: SocketOnlineUser;
  update: SocketOnlineUser;
};

// Static types exported for availability in component construction
export type Modals = "socket" | "name" | "users" | "message" | null;
export type SocketPrivateMessage = {
  from: string | undefined;
  name: string;
  to: string;
  message: string;
  timestamp: number;
};
export type SocketBroadcastMessage = {
  from: string | undefined;
  name: string;
  message: string;
  timestamp: number;
};
export type SocketOnlineUser = {
  socketId: string;
  name: string | null;
};
export type MessageWithMe = {
  from: string | undefined;
  name: string;
  me: boolean;
  message: string;
  timestamp: number;
};
export type AvatarProps = {
  user?: string;
  statusBubble?: boolean;
};
export type ModalProps = {
  children: ReactNode;
};
export type SectionProps = {
  children: ReactNode;
  layout: "header" | "viewport" | "message-input";
};
export type MessageBubbleProps = {
  children: ReactNode;
  layout: "message-from-me" | "message-from-others";
};
export type ButtonProps = {
  action: CallableFunction;
  buttonPic: StaticImageData;
  altText: string;
};

// Interfaces exported for component construction
export interface Store {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  name: string;
  setName: (name: string) => void;
  targetSocket: TargetSocket;
  setTargetSocket: (socket: TargetSocket) => void;
  socket: null | Socket;
  emitMode: keyof EmitModeDataTypes;
  setEmitMode: (mode: keyof EmitModeDataTypes) => void;
  emit: <T extends keyof EmitModeDataTypes>(
    event: T,
    data: EmitModeDataTypes[T]
  ) => void;
  connect: () => void;
  disconnect: () => void;
  messages: MessageWithMe[];
  setMessages: (message: MessageWithMe) => void;
  updateMessageNames: (updatedUser: SocketOnlineUser) => void;
  activeModal: Modals;
  setActiveModal: (modal: Modals) => void;
  isMounted: boolean;
  setIsMounted: (mountState: boolean) => void;
}
