import { FC, useEffect, useRef } from "react";
import styles from "../styles/components.module.css";
import { ModalProps } from "@/lib/types/next";
import useStore from "@/lib/storage/state";

const Modal: FC<ModalProps> = ({ children }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { activeModal, setActiveModal, isMounted, setIsMounted } = useStore();

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 40);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsMounted(false);
        setTimeout(() => setActiveModal(null), 100);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      setIsMounted(false);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={componentRef}
      className={`${
        activeModal === "name" ? styles["name-modal-container"] : styles.modal
      } ${isMounted && styles.visible} ${
        (activeModal === "users" || activeModal === "message") &&
        styles["users-list"]
      }`}
      data-testid={activeModal}
    >
      {children}
    </div>
  );
};

export default Modal;
