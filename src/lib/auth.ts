import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email/client";
import { welcomeEmail, passwordResetEmail } from "@/lib/email/templates";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    // Better Auth generates the tokenised reset `url`; we just deliver it.
    sendResetPassword: async ({ user, url }) => {
      const { subject, html } = passwordResetEmail({ name: user.name, url });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Fires once the user row is committed (covers email/password signup).
        // sendEmail is fail-safe, so a delivery hiccup never breaks signup.
        after: async (user) => {
          const { subject, html } = welcomeEmail({ name: user.name });
          await sendEmail({ to: user.email, subject, html });
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
