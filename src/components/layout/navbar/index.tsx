import { NavbarAdress } from "@/components/layout/navbar/adress";
import { NavbarConnectWallet } from "@/components/layout/navbar/wallet";
import Image from "next/image";
import Link from "next/link";
import Logo from "~/logo.png";
import styles from "./navbar.module.css";

/**
 * Navigation bar that shows up on all pages.
 */
export const Navbar = () => {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src={Logo}
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/buy" className={styles.link}>
              Buy
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <NavbarConnectWallet />
          <NavbarAdress />
        </div>
      </nav>
    </div>
  );
};
