"use client";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/firebase/getCurrentUser";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
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
        <SignUpForm />
      </div>
    </div>
  );
}
