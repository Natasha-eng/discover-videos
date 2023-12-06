import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";

import { magic } from "../../lib/magic-client";

import styles from "./navbar.module.css";

const NavBar = () => {
  const [userName, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [didToken, setDidToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { email, issuer } = await magic.user.getInfo();

        const didToken = await magic.user.getIdToken();

        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.log("Error retrieving email", error);
      }
    };

    getUserInfo();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const handleSignout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src={"/static/netflix.svg"}
              alt="Netflix logo"
              width={128}
              height={34}
            />
          </div>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{userName}</p>
              {/* Expand more icon */}
              <Image
                src={"/static/expand_more.svg"}
                alt="Expand dropdown"
                width={24}
                height={24}
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <Link
                  className={styles.linkName}
                  href="/login"
                  onClick={handleSignout}
                >
                  Sign out
                </Link>
                <div className={styles.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
