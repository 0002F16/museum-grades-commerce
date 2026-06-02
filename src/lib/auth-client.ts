"use client";
import { createAuthClient } from "better-auth/react";

// baseURL is omitted — requests go to /api/auth/... on the current origin.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
