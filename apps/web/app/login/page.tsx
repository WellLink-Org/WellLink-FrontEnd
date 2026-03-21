import AuthCard from "../../components/AuthCard/AuthCard";
import Divider from "../../components/Divider/Divider";
import Input from "../../components/Input/Input";
import SocialButton from "../../components/SocialButton/SocialButton";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Log in - WellLink",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your WellLink account to view your health dashboard."
      footerText="Don't have an account?"
      footerLinkText="Sign up free"
      footerLinkHref="/signup"
    >
      {/* Social logins */}
      <div className={styles.socials}>
        <SocialButton provider="google" action="login" />
        <SocialButton provider="apple" action="login" />
      </div>

      <Divider label="or continue with email" />

      {/* Email form */}
      <form className={styles.form} action="#" method="post">
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <div className={styles.forgotRow}>
          <Link href="/forgot-password" className={styles.forgot}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Log in
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </AuthCard>
  );
}
