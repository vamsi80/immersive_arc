"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { firebaseLogin } from "@/lib/firebase/firebase-login";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { firebaseForgotPassword } from "@/lib/firebase/firebase-forgot-password";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await firebaseLogin(email, password);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message ?? null);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg(null);
    const result = await firebaseForgotPassword(forgotEmail);
    setForgotLoading(false);
    if (result.success) {
      setForgotMsg("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setForgotOpen(false);
        setForgotMsg(null);
      }, 2000); // Close dialog after 2 seconds
    } else {
      setForgotMsg(result.message || "Failed to send reset email.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your immersive account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                    <DialogTrigger asChild>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setForgotOpen(true);
                        }}
                      >
                        Forgot your password?
                      </a>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs w-full">
                      <DialogHeader>
                        <DialogTitle>Forgot Password</DialogTitle>
                        <DialogDescription>
                          {forgotMsg &&
                          forgotMsg.startsWith("Password reset email sent")
                            ? forgotMsg
                            : "Enter your email address and we'll send you a password reset link."}
                        </DialogDescription>
                      </DialogHeader>
                      {forgotMsg &&
                      forgotMsg.startsWith("Password reset email sent") ? (
                        <div className="text-green-600 text-center py-6 font-medium">
                          {forgotMsg}
                        </div>
                      ) : (
                        <form
                          onSubmit={handleForgotPassword}
                          className="grid gap-4"
                        >
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                          {forgotMsg && (
                            <div className="text-sm text-center text-muted-foreground">
                              {forgotMsg}
                            </div>
                          )}
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={forgotLoading}
                            >
                              {forgotLoading
                                ? "Sending..."
                                : "Send Reset Email"}
                            </Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/1.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={400}
              height={400}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a
          onClick={() => router.push("/Terms_And_Services")}
          className="cursor-pointer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          onClick={() => router.push("/Privacy_And_Policy")}
          className="cursor-pointer"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
