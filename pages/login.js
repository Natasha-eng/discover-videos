import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { magic } from "../lib/magic-client";

import styles from "../styles/login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (email) {
      // log in a user by their email
      try {
        const DIDToken = await magic.auth.loginWithMagicLink({
          email,
        });

        if (DIDToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${DIDToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();

          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setUserMsg("Something went wrong logging in");
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.log("Something went wrong logging in", error);
        setIsLoading(false);
      }
    } else {
      //show user message
      setUserMsg("Enter a valid email address");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            className={styles.emailInput}
            type="text"
            placeholder="Email address"
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {isLoading ? "Loading" : " Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
