// app/login/LoginForm.tsx
"use client";

import AuthCard from "../../components/AuthCard/AuthCard";
import Divider from "../../components/Divider/Divider";
import Input from "../../components/Input/Input";
import SocialButton from "../../components/SocialButton/SocialButton";
import styles from "./page.module.css";
import RoleSelector from "../../components/RoleSelector/RoleSelector";
import { useState } from "react";

export default function SignupForm() {
  const [role, setRole] = useState<"user" | "doctor">("user");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const params = new URLSearchParams({
      screen_hint: "signup",
      login_hint: email,
      redirect_uri: `/post-signup?role=${role}`,
    });
    window.location.href = `/auth/login?${params}`;
  };
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join WellLink to sync your health data and get personalised AI insights."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      {/* Role selector */}
      <RoleSelector value={role} onChange={setRole} />

      {/* Social signups */}
      <div className={styles.socials}>
        <SocialButton provider="google" action="signup" role={role} />
        <SocialButton provider="apple" action="signup" role={role} />
      </div>

      <Divider label="or sign up with email" />

      {/* Email form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nameRow}>
          <Input
            id="firstName"
            label="First name"
            type="text"
            placeholder="Jane"
            autoComplete="given-name"
            required
          />
          <Input
            id="lastName"
            label="Last name"
            type="text"
            placeholder="Smith"
            autoComplete="family-name"
            required
          />
        </div>

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Create account
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
