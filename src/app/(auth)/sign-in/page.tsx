"use client";

import { LoginForm } from "@/components/auth/sign-in-form";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/firebase/getCurrentUser";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        router.replace("/dashboard");
      }
    });
  }, [router]);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {/* <SignUpForm /> */}
        <LoginForm />
      </div>
    </div>
  );
}
