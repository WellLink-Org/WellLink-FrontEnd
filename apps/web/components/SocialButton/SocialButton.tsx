import styles from "./SocialButton.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

interface SocialButtonProps {
  provider: "google" | "apple";
  action: "login" | "signup";
}

const PROVIDERS = {
  google: {
    label: "Google",
    icon: <FcGoogle size={18} />,
  },
  apple: {
    label: "Apple",
    icon: <FaApple size={18} />,
  },
};

export default function SocialButton({ provider, action }: SocialButtonProps) {
  const { label, icon } = PROVIDERS[provider];
  return (
    <button
      className={styles.btn}
      type="button"
      aria-label={`${action === "login" ? "Sign in" : "Sign up"} with ${label}`}
    >
      <span className={styles.icon}>{icon}</span>
      <span>
        {action === "login" ? "Continue" : "Sign up"} with {label}
      </span>
    </button>
  );
}
