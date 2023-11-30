"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "./navbar.module.css";

export const NavbarConnectWallet = () => {
  return (
    <div className={styles.navConnect}>
      <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
    </div>
  );
};
