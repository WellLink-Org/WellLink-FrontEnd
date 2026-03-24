"use client";
import styles from "./Navbar.module.css";
import Logo from "../Logo/Logo";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className={styles.nav}>
      <Logo />
      <ul className={styles.links}>
        <li>
          <Link href="#features">Features</Link>
        </li>
        <li>
          <Link href="#how-it-works">How It Works</Link>
        </li>
        <li>
          <Link href="#doctors">For Doctors</Link>
        </li>
        <li>
          <Link href="#about">About</Link>
        </li>
      </ul>
      <div className={styles.actions}>
        {user ? (
          <Link href="/dashboard" className={styles.loginBtn}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className={styles.loginBtn}>
            Log in
          </Link>
        )}

        <Link href="/download" className={styles.downloadBtn}>
          Download App
        </Link>
      </div>
    </nav>
  );
}
