// app/api/[[...route]]/route.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { setCookie, getCookie } from "hono/cookie";
import { adminAuth } from "@/lib/firebase/admin";
// import z from "zod";
import {
  getFirestore as getAdminFirestore,
  getFirestore,
} from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const app = new Hono().basePath("/api");

app.post("/login", async (c) => {
  const { token } = await c.req.json();
  try {
    const decoded = await adminAuth.verifyIdToken(token);

    setCookie(c, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    return c.json({ status: "success", uid: decoded.uid });
  } catch (e) {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

app.get("/me", async (c) => {
  const token = getCookie(c, "auth_token");
  if (!token) return c.json({ error: "Not logged in" }, 401);

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return c.json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    return c.json({ error: "Invalid token" }, 401);
  }
});

app.post("/logout", (c) => {
  setCookie(c, "auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  });

  return c.json({ status: "logged out" });
});

app.post("/check-user", async (c) => {
  const { email } = await c.req.json();
  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }
  try {
    const userRecord = await getAuth().getUserByEmail(email);
    return c.json({ exists: true, uid: userRecord.uid });
  } catch (err) {
    // If user not found, Firebase throws an error
    if (
      err &&
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "auth/user-not-found"
    ) {
      return c.json({ exists: false });
    }
    return c.json({ error: "Error checking user" }, 500);
  }
});

app.post("/check-mobile", async (c) => {
  const { mobile } = await c.req.json();
  if (!mobile) {
    return c.json({ error: "Mobile number is required" }, 400);
  }
  try {
    const db = getAdminFirestore();
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("general.mobile", "==", mobile)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      // Mobile found
      const user = snapshot.docs[0];
      return c.json({ exists: true, userId: user.id });
    }
    return c.json({ exists: false });
  } catch (err) {
    return c.json({ error: "Error checking mobile number" }, 500);
  }
});

// GET /api/users/:userid - Check if user exists by userId
app.get("/users/:userid", async (c) => {
  const { userid } = c.req.param();
  const db = getFirestore();
  try {
    const userDoc = await db.collection("users").doc(userid).get();
    if (!userDoc.exists) {
      return c.json({ exists: false });
    }
    return c.json({ exists: true, data: userDoc.data() });
  } catch (error) {
    return c.json(
      { error: "Failed to check user", details: String(error) },
      500
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
