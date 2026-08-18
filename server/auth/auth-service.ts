import "server-only";

import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

export class AuthenticationRequiredError extends AuthServiceError {
  constructor() {
    super("Authentication is required.");
    this.name = "AuthenticationRequiredError";
  }
}

function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();

  if (!normalized || !normalized.includes("@")) {
    throw new AuthServiceError("A valid email address is required.");
  }

  return normalized;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (error.status === 401 || error.status === 403) {
      return null;
    }

    throw new AuthServiceError("Unable to resolve the current user.", error);
  }

  return data.user;
}

export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationRequiredError();
  }

  return user;
}

export async function requestEmailSignIn(
  email: string,
  redirectTo?: string,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const normalizedEmail = normalizeEmail(email);

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
    },
  });

  if (error) {
    throw new AuthServiceError("Unable to send the sign-in email.", error);
  }
}

export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<User> {
  const supabase = await createSupabaseServerClient();
  const normalizedEmail = normalizeEmail(email);
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new AuthServiceError("OTP token is required.");
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: normalizedToken,
    type: "email",
  });

  if (error || !data.user) {
    throw new AuthServiceError("Unable to verify the sign-in code.", error);
  }

  return data.user;
}

export async function signOutCurrentUser(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AuthServiceError("Unable to sign out.", error);
  }
}
