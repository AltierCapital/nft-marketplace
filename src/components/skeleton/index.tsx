import styles from "./skeleton.module.css";

type Props = {
  width?: string;
  height?: string;
};

export const Skeleton = ({ height, width }: Props) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "inherit",
      }}
      className={styles.skeleton}
    />
  );
};
