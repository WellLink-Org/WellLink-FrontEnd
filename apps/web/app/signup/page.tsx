import AuthCard from "../../components/AuthCard/AuthCard";
import Divider from "../../components/Divider/Divider";
import Input from "../../components/Input/Input";
import RoleSelector from "../../components/RoleSelector/RoleSelector";
import SocialButton from "../../components/SocialButton/SocialButton";
import styles from "./page.module.css";
import SignupForm from "./SignupForm";

export const metadata = {
  title: "Sign up - WellLink",
};

export default function SignupPage() {
  return <SignupForm />;
}
