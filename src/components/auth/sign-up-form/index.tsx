"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { firebaseSignUp } from "@/lib/firebase/firebase-signup";
import { createUserInFirestore } from "@/lib/firebase/create-user";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CountrySelect } from "../../ui/country-select";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");


  async function handleFinalSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await firebaseSignUp(email, password);
    if (result.success && result.user) {
      const userId = result.user.uid;
      const userData = {
        general: {
          name,
          age,
          country,
          email: result.user.email,
        },
        createdAt: new Date().toISOString(),
      };
      const firestoreResult = await createUserInFirestore(userId, userData);
      console.log("firestoreResult: ", firestoreResult);
      setLoading(false);
      if (firestoreResult.success) {
        router.push("/dashboard");
      } else {
        setError("Failed to save user data. Please try again.");
      }
    } else {
      setLoading(false);
      setError(result.message ?? null);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setShowDialog(true);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up to get started with Humeo
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Next"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() => router.push("/sign-in")}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      router.push("/sign-in");
                  }}
                >
                  sign-in
                </a>
              </div>
            </div>
          </form>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogTitle id="dialog-title">Complete your profile</DialogTitle>
              <form
                onSubmit={handleFinalSignUp}
                className="flex flex-col gap-4"
                aria-labelledby="dialog-title"
              >
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />

                <CountrySelect value={country} onChange={setCountry} />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/sign-up.svg"
              alt="Sign Up Image"
              className="absolute inset-0 h-full w-auto object-cover dark:brightness-[0.2] dark:grayscale"
              width={400}
              height={400}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our{" "}
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
