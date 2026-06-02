"use client";

import { useActionState } from "react";
import type { ActionState } from "../actions";
import { createCampaign } from "../actions";

const initialState: ActionState = {};

const inputClassName =
  "w-full rounded-lg border border-nam-border bg-black/40 px-3 py-2 text-sm outline-none focus:border-nam-green";

export default function CampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaign, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-foreground/70">
          Campaign name
        </label>
        <input id="name" name="name" required className={inputClassName} />
      </div>
      <div>
        <label htmlFor="xProfileUrl" className="mb-1 block text-sm text-foreground/70">
          X profile URL
        </label>
        <input
          id="xProfileUrl"
          name="xProfileUrl"
          type="url"
          required
          placeholder="https://x.com/username"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-foreground/50">
          We will fetch the influencer profile picture from this X account.
        </p>
      </div>
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm text-foreground/70">
          Referral slug (optional)
        </label>
        <input
          id="slug"
          name="slug"
          pattern="[a-z0-9][a-z0-9-]{0,62}[a-z0-9]"
          title="Lowercase letters, numbers, and hyphens only"
          placeholder="auto-generated from X handle"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-foreground/50">
          Referral link format: /ref/your-slug
        </p>
      </div>
      <div>
        <label htmlFor="status" className="mb-1 block text-sm text-foreground/70">
          Status
        </label>
        <select id="status" name="status" className={inputClassName} defaultValue="DRAFT">
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
        </select>
      </div>
      <div>
        <label htmlFor="budget" className="mb-1 block text-sm text-foreground/70">
          Budget (USD)
        </label>
        <input
          id="budget"
          name="budget"
          type="number"
          min="0"
          step="0.01"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create campaign"}
      </button>
    </form>
  );
}
