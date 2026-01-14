import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login - LeetCode Academy",
  description: "Sign in to LeetCode Academy",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}
