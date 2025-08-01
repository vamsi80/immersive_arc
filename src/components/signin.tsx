'use client';
import React from "react";
import { SignInPage } from "@/components/ui/sign-in";

const SignInPageDemo = () => {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign In submitted:", data);
    alert(`Sign In Submitted! Check the browser console for form data.`);
  };

  return (
    <div className="bg-background text-foreground p-0">
      <SignInPage
        heroImageSrc="/1.jpeg"
        onSignIn={handleSignIn}
      />
    </div>
  );
};

export default SignInPageDemo;
