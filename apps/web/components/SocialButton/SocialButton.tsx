"use client";
import styles from "./SocialButton.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

interface SocialButtonProps {
  provider: "google" | "apple";
  action: "login" | "signup";
  role?: "user" | "doctor";
}

const PROVIDERS = {
  google: {
    label: "Google",
    icon: <FcGoogle size={18} />,
    connection: "google-oauth2",
  },
  apple: {
    label: "Apple",
    icon: <FaApple size={18} />,
    connection: "apple",
  },
};

export default function SocialButton({
  provider,
  action,
  role,
}: SocialButtonProps) {
  const { label, icon, connection } = PROVIDERS[provider];

  const handleClick = () => {
    const params = new URLSearchParams({
      connection,
      screen_hint: action === "signup" ? "signup" : "login",
    });

    params.set("returnTo", `/post-login${role ? `?role=${role}` : ""}`);

    window.location.href = `/auth/login?${params}`;
  };

  return (
    <button
      className={styles.btn}
      type="button"
      aria-label={`${action === "login" ? "Sign in" : "Sign up"} with ${label}`}
      onClick={handleClick}
    >
      <span className={styles.icon}>{icon}</span>
      <span>
        {action === "login" ? "Continue" : "Sign up"} with {label}
      </span>
    </button>
  );
}
