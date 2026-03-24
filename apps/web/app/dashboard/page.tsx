import { redirect } from "next/navigation";
import { auth0 } from "../../lib/auth0";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session) redirect("/login");

  const role = session.user["https://welllink.app/role"] ?? "user";

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Role: {role}</p>
      <p>Email: {session.user.email}</p>
      <a href="/auth/logout">Log out</a>
    </div>
  );
}
