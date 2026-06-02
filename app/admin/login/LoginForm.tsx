"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-foreground/70">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-nam-border bg-black/40 px-3 py-2 text-sm outline-none focus:border-nam-green"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
