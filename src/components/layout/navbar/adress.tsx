"use client";

import { useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import UserIcon from "~/user-icon.png";
import styles from "./navbar.module.css";

export const NavbarAdress = () => {
  const address = useAddress();

  return (
    <>
      {address ? (
        <Link className={styles.link} href={`/profile/${address}`}>
          <Image
            className={styles.profileImage}
            src={UserIcon}
            width={42}
            height={42}
            alt="Profile"
          />
        </Link>
      ) : null}
    </>
  );
};
