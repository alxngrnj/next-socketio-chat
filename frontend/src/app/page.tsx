"use client";
import {
  FormEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MessageWithMe,
  Modals,
  SocketBroadcastMessage,
  SocketOnlineUser,
  SocketPrivateMessage,
} from "@/lib/types/next";
import toast from "react-hot-toast";
import useStore from "@/lib/storage/state";
import Image from "next/image";
import Avatar from "@/ui/components/Avatar";
import Button from "@/ui/components/Button";
import DropdownIcon from "@/../public/dropdown.svg";
import PreloaderIcon from "@/../public/preloader.svg";
import CopyIcon from "@/../public/copy.svg";
import Modal from "@/ui/components/Modal";
import ConnectIcon from "@/../public/connect.svg";
import ClipboardIcon from "@/../public/clipboard.svg";
import SunIcon from "@/../public/sun.svg";
import MoonIcon from "@/../public/moon.svg";
import SendIcon from "@/../public/send.svg";
import UsersIcon from "@/../public/users.svg";
import BroadcastIcon from "@/../public/broadcast.svg";
import PrivateMessageIcon from "@/../public/private-message.svg";
import DisconnectIcon from "@/../public/disconnect.svg";
import EditIcon from "@/../public/edit.svg";
import GreenCheckIcon from "@/../public/green-check.svg";
import SocialSparkleLogo from "@/../public/social-sparkle-logo.svg";
import CloseIcon from "@/../public/close.svg";
import styles from "../ui/styles/chatroom.module.css";
import ChatroomSection from "@/ui/components/ChatroomSection";
import MessageBubble from "@/ui/components/MessageBubble";

export default function Home() {
  const {
    theme,
    setTheme,
    name,
    setName,
    socket,
    connect,
    disconnect,
    emitMode,
    emit,
    setEmitMode,
    messages,
    setMessages,
    updateMessageNames,
    targetSocket,
    setTargetSocket,
    activeModal,
    setActiveModal,
    setIsMounted,
  } = useStore();
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});
  const [copyButtonIcon, setCopyButtonIcon] = useState(CopyIcon);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message) return toast.error("Please enter a message");
    if (!socket?.connected) return toast.error("Please reconnect server first");
    if (!targetSocket && emitMode === "private_message")
      return toast.error("Please enter a target socket id");

    switch (emitMode) {
      case "private_message": {
        const messageObj = {
          from: socket.id,
          name,
          to: targetSocket || "",
          timestamp: Date.now(),
          me: true,
          message,
        };
        emit("private_message", messageObj);
        break;
      }
      case "broadcast": {
        const broadcastObj = {
          from: socket.id,
          name,
          timestamp: Date.now(),
          me: true,
          message,
        };
        emit("broadcast", broadcastObj);
        break;
      }
      default:
        break;
    }
    setMessage("");
    messageInputRef.current?.focus();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      e.altKey !== true &&
      e.shiftKey !== true &&
      e.ctrlKey !== true
    ) {
      e.preventDefault();
      sendMessage();
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  const closeModal = () => {
    setIsMounted(false);
    setTimeout(() => setActiveModal(null), 100);
  };
  const updateName = (e: FormEvent) => {
    e.preventDefault();

    if (!socket?.connected) return toast.error("Please reconnect server first");
    if (!nameInputRef.current?.value) return toast.error("Insert a new name");

    const newUserData: SocketOnlineUser = {
      socketId: socket?.id || "",
      name: nameInputRef.current.value,
    };

    setName(nameInputRef.current.value);
    emit("update", newUserData);
    toast.success("nome alterado");
    closeModal();
  };
  const handleModalChange = (modalType: Modals) => {
    if (!activeModal) {
      setActiveModal(modalType);
    } else if (activeModal !== modalType) {
      setTimeout(() => setActiveModal(modalType), 110);
    }
  };
  const copySocketId = async (userId?: string) => {
    if (userId) {
      handleModalChange("message");
      setTargetSocket(userId);
      setEmitMode("private_message");
      await navigator.clipboard.writeText(userId);
    } else if (socket?.id) {
      await navigator.clipboard.writeText(socket.id);
      setCopyButtonIcon(GreenCheckIcon);
      toast.success(`Copied: ${socket.id}`);
      setTimeout(() => setCopyButtonIcon(CopyIcon), 2000);
    }
  };

  useEffect(() => {
    connect();
  }, [connect]);
  useEffect(() => {
    emit("join", { socketId: socket?.id || "", name: name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket?.id]);
  useEffect(() => {
    if (!socket) return;
    socket.on("private_message", (message: SocketPrivateMessage) => {
      setMessages({ ...message, me: message.from === socket?.id });
    });
    socket.on("broadcast", (message: SocketBroadcastMessage) => {
      setMessages({ ...message, me: message.from === socket?.id });
    });
    socket.on("update", (updatedUser) => {
      updateMessageNames(updatedUser);
    });
    socket.on("online_user", (onlineUsers: Record<string, string>) => {
      setOnlineUsers(onlineUsers);
    });
    return () => {
      socket.off("private_message");
      socket.off("online_user");
      socket.off("broadcast");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(systemTheme);
    document.documentElement.setAttribute("data-theme", systemTheme);

    return () => useStore.persist.clearStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.main}>
      <ChatroomSection layout={"header"}>
        <div className={styles["header-div"]}>
          <Avatar statusBubble={true} user={socket?.id ? name : undefined} />
          <Button
            buttonPic={DropdownIcon}
            altText="Dropdown arrow"
            action={() => handleModalChange("socket")}
          />
          <div className={styles["edit-button"]}>
            <Button
              buttonPic={EditIcon}
              altText="Pencil arrow"
              action={() => handleModalChange("name")}
            />
          </div>
          {activeModal === "socket" && (
            <Modal>
              <div className={styles["modal-line"]}>
                <p>SocketID</p>
                {socket?.id ? (
                  <Button
                    buttonPic={copyButtonIcon}
                    altText="Icon indicating the socket copy function"
                    action={copySocketId}
                  />
                ) : (
                  <Image alt="Preloader" src={PreloaderIcon} />
                )}
              </div>
              <div className={styles["modal-line"]}>
                <p>Actions</p>
                {socket?.id ? (
                  <Button
                    buttonPic={DisconnectIcon}
                    altText="Icon indicating the disconnect socket function"
                    action={() => disconnect()}
                  />
                ) : (
                  <Button
                    buttonPic={ConnectIcon}
                    altText="Icon indicating the connect socket function"
                    action={() => connect()}
                  />
                )}
              </div>
            </Modal>
          )}
        </div>
        <div className={styles["header-div"]}>
          <Button
            buttonPic={theme === "light" ? SunIcon : MoonIcon}
            altText="Sun icon representing a light theme for the page"
            action={toggleTheme}
          />
          <div className={styles.toggles}>
            <span
              className={`${styles.slider} ${
                emitMode === "broadcast"
                  ? styles["broadcast-slider"]
                  : styles["direct-message-slider"]
              }`}
            />
            <label
              className={
                emitMode === "broadcast"
                  ? styles["active-switch"]
                  : styles.switch
              }
            >
              <Image src={BroadcastIcon} alt="Broadcast signal icon" />
              <span className="label-text">Broadcast</span>
              <input
                name="message-type"
                type="radio"
                onClick={() => setEmitMode("broadcast")}
                defaultChecked
              />
            </label>

            <label
              className={
                emitMode === "private_message"
                  ? styles["active-switch"]
                  : styles.switch
              }
            >
              <Image src={PrivateMessageIcon} alt="Private message icon" />
              <span className="label-text">To</span>
              <input
                name="message-type"
                type="radio"
                onClick={() => {
                  setEmitMode("private_message");
                  handleModalChange("message");
                }}
              />
            </label>
          </div>
          {activeModal === "message" && (
            <Modal>
              <div className={styles["modal-line"]}>
                <label htmlFor="socket-id">Target socket id</label>
                <Button
                  buttonPic={ClipboardIcon}
                  altText="Clipboard icon"
                  action={async () => {
                    if (socket?.id) {
                      setTargetSocket(await navigator.clipboard.readText());
                    }
                  }}
                />
              </div>
              <input
                name="socket-id"
                value={targetSocket}
                onChange={(e) => setTargetSocket(e.currentTarget.value)}
                placeholder="Paste the socket id here"
                type="text"
              />
            </Modal>
          )}
          <Button
            buttonPic={UsersIcon}
            altText="User list Icon"
            action={() => handleModalChange("users")}
          />
          {activeModal === "users" && (
            <Modal>
              <p className={styles["users-title"]}>Online users</p>
              {onlineUsers &&
                Object.entries(onlineUsers).map((entry) => {
                  const [userId, userName] = entry;
                  if (userId != socket?.id) {
                    return (
                      <div
                        key={userId}
                        onClick={() => copySocketId(userId)}
                        className={styles["users-line"]}
                      >
                        <Avatar statusBubble={true} />
                        <p>{userName}</p>
                      </div>
                    );
                  }
                })}
            </Modal>
          )}
        </div>
      </ChatroomSection>
      <ChatroomSection layout={"viewport"}>
        {messages.map((message: MessageWithMe, index) => {
          return (
            <Fragment key={message.timestamp + index}>
              {message.me ? (
                <MessageBubble layout={"message-from-me"}>
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp)
                      .toLocaleTimeString()
                      .slice(0, 5)}
                  </span>
                  <p>
                    {message.message.split("\n").map((line, index) => {
                      return (
                        <span key={message.timestamp + index}>
                          {line}
                          <br />
                        </span>
                      );
                    })}
                  </p>
                </MessageBubble>
              ) : (
                <MessageBubble layout={"message-from-others"}>
                  <Avatar user={message.name} />
                  <p>
                    {message.message.split("\n").map((line, index) => {
                      return (
                        <span key={message.timestamp + index}>
                          {line}
                          <br />
                        </span>
                      );
                    })}
                  </p>
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp)
                      .toLocaleTimeString()
                      .slice(0, 5)}
                  </span>
                </MessageBubble>
              )}
            </Fragment>
          );
        })}
        <Image src={SocialSparkleLogo} alt="App logo" className={styles.logo} />
      </ChatroomSection>
      <ChatroomSection layout={"message-input"}>
        <form className={styles["chat-input"]}>
          <textarea
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            placeholder="Type something..."
            onKeyDown={handleKeyDown}
          />
          <Button
            buttonPic={SendIcon}
            altText="test"
            action={() => sendMessage()}
          />
        </form>
      </ChatroomSection>
      {activeModal === "name" && (
        <Modal>
          <div className={styles["modal-backdrop"]} />
          <div className={styles["name-modal"]}>
            <div className={styles["modal-line"]}>
              <h3>New name</h3>
              <Button
                buttonPic={CloseIcon}
                altText="X icon"
                action={closeModal}
              />
            </div>
            <form onSubmit={updateName}>
              <div className={styles["modal-line"]}>
                <label htmlFor="name-input">Your new name</label>
              </div>
              <input ref={nameInputRef} id="name-input"></input>
              <button type="submit">Submit</button>
            </form>
            <p className={styles["name-info"]}>Your current name is {name}</p>
          </div>
        </Modal>
      )}
    </main>
  );
}
