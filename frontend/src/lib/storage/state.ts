import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import { Store } from "../types/next";
import toast from "react-hot-toast";

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
      },
      name: uuidv4(),
      setName: (name) => {
        set({ name });
      },
      targetSocket: undefined,
      setTargetSocket: (socket) => {
        set({ targetSocket: socket });
      },
      socket: null,
      emitMode: "broadcast",
      setEmitMode: (mode) => {
        set({ emitMode: mode });
      },
      emit: (event, data) => {
        const { socket } = get();
        if (!socket) return toast.error("Socket not connected");
        socket.emit(event, data, (response: { ok: boolean }) => {
          if (!response.ok) toast.error("Something went wrong");
        });
      },
      connect: () => {
        const { socket } = get();

        if (socket) {
          console.log("Socket already connected", socket);
          toast.error("Socket already connected");
        } else {
          console.log("Connecting to socket on localhost:3001");
          const socket = io("http://localhost:3001");
          socket
            .on("connect", () => {
              console.log("SOCKET CONNECTED!", socket.id);
              set({ socket });
            })
            .on("disconnect", () => {
              console.log("SOCKET DISCONNECTED!");
              set({ socket: null });
            });
        }
      },
      disconnect: () => {
        const { socket } = get();
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        } else {
          toast.error("Socket not connected");
        }
      },
      messages: [],
      setMessages: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },
      updateMessageNames: (updatedUser) => {
        set((state) => ({
          messages: state.messages.map((message) => {
            if (message.from == updatedUser.socketId) {
              return {
                ...message,
                name:
                  updatedUser.name !== null ? updatedUser.name : message.name,
              };
            }
            return message;
          }),
        }));
      },
      activeModal: null,
      setActiveModal: (modal) => {
        set({ activeModal: modal });
      },
      isMounted: false,
      setIsMounted: (mountState) => {
        set({ isMounted: mountState });
      },
    }),
    {
      name: "chat_storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        name: state.name,
        messages: state.messages,
        theme: state.theme,
      }),
    }
  )
);

export default useStore;
