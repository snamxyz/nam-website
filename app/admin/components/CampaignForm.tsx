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
        <label htmlFor="profileUrl" className="mb-1 block text-sm text-foreground/70">
          Profile link
        </label>
        <input
          id="profileUrl"
          name="profileUrl"
          type="url"
          required
          placeholder="https://youtube.com/@creator"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-foreground/50">
          Paste the creator profile link for their primary platform.
        </p>
      </div>
      <div>
        <label htmlFor="platform" className="mb-1 block text-sm text-foreground/70">
          Platform
        </label>
        <select id="platform" name="platform" className={inputClassName} defaultValue="YOUTUBE">
          <option value="YOUTUBE">YouTube</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="contactInfo" className="mb-1 block text-sm text-foreground/70">
          Contact info
        </label>
        <textarea
          id="contactInfo"
          name="contactInfo"
          rows={3}
          placeholder="Email, phone, manager, notes..."
          className={inputClassName}
        />
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
          placeholder="auto-generated from creator name"
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
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create creator"}
      </button>
    </form>
  );
}
