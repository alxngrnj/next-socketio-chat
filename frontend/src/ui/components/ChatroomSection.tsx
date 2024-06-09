import { FC, useLayoutEffect, useRef } from "react";
import { SectionProps } from "@/lib/types/next";
import styles from "../styles/components.module.css";
import useStore from "@/lib/storage/state";

const ChatroomSection: FC<SectionProps> = ({ children, layout }) => {
  const chatViewportRef = useRef<HTMLDivElement>(null);
  const { messages } = useStore();
  const scrollToBottom = () => {
    chatViewportRef?.current?.scrollTo({
      top: chatViewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  };
  useLayoutEffect(() => scrollToBottom(), [messages]);
  return (
    <div
      className={`${styles.section} ${styles[layout]}`}
      ref={layout === "viewport" ? chatViewportRef : null}
    >
      {children}
    </div>
  );
};

export default ChatroomSection;
