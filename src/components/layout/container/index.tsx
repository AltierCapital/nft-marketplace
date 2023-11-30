import type { PropsWithChildren } from "react";
import styles from "./container.module.css";

type Props = {
  maxWidth: "xs" | "sm" | "md" | "lg" | "xl";
};

/**
 * A container component that sets the max-width of its children, and centers them on the page.
 * @param maxWidth: The max-width of the container. Can be "sm", "md", "lg", "xl", or "2xl".
 */
export const Container = ({ maxWidth, children }: PropsWithChildren<Props>) => {
  return (
    <div className={`${styles.container} ${styles[maxWidth]}`}>{children}</div>
  );
};
