import { FC } from "react";
import { MessageBubbleProps } from "@/lib/types/next";
import styles from "../styles/components.module.css";

const MessageBubble: FC<MessageBubbleProps> = ({ children, layout }) => (
  <div className={`${styles["message-bubble"]} ${styles[layout]}`}>
    {children}
  </div>
);

export default MessageBubble;
