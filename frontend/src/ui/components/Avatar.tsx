import { FC } from "react";
import styles from "@/ui/styles/components.module.css";
import UserIcon from "@/../public/user.svg";
import Image from "next/image";
import { AvatarProps } from "@/lib/types/next";
import useStore from "@/lib/storage/state";

const Avatar: FC<AvatarProps> = ({ user, statusBubble }) => {
  const { socket } = useStore();

  return (
    <div className={styles["avatar-bubble"]}>
      {statusBubble && (
        <div className={socket?.id ? styles.connected : styles.disconnected} />
      )}
      {user ? (
        user.length > 4 ? (
          `${user.slice(0, 1)}`
        ) : (
          user
        )
      ) : (
        <Image
          style={{ height: "1.5rem", width: "1.5rem" }}
          src={UserIcon}
          alt="User icon"
        />
      )}
    </div>
  );
};

export default Avatar;
