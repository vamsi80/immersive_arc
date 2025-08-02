import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./client";

/**
 * Returns a promise that resolves with the current logged-in Firebase user.
 * Resolves with `null` if no user is signed in.
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
