"use client";
import { useSearchParams } from "next/navigation";
import AuthCard from "../../components/AuthCard/AuthCard";
import RoleSelector from "../../components/RoleSelector/RoleSelector";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { userAPI } from "../api/client/userAPI";

export default function createAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
  const [role, setRole] = useState<"user" | "doctor">("user");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (userId) {
      await userAPI.updateRole(userId, role);
      router.push("/dashboard");
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join WellLink to sync your health data and get personalised AI insights."
    >
      <p className={styles.label}>Email</p>
      <p className={styles.email}>{email}</p>
      {/* Role selector */}
      <RoleSelector value={role} onChange={setRole} />

      {/* Email form */}
      <button className={styles.submitBtn} onClick={handleSubmit}>
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
    </AuthCard>
  );
}
