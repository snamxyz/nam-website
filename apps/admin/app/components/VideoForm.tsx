"use client";

import { useActionState } from "react";
import type { ActionState } from "../actions";
import { createVideo } from "../actions";

const initialState: ActionState = {};

const inputClassName =
  "w-full rounded-lg border border-nam-border bg-white px-3 py-2 text-sm outline-none focus:border-nam-green";

export default function VideoForm({ campaignId }: { campaignId: string }) {
  const [state, formAction, pending] = useActionState(createVideo, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-nam-border bg-nam-card p-5 lg:grid-cols-2">
      <input type="hidden" name="campaignId" value={campaignId} />
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-foreground/70">
          Video name
        </label>
        <input id="name" name="name" required className={inputClassName} />
      </div>
      <div>
        <label htmlFor="videoUrl" className="mb-1 block text-sm text-foreground/70">
          Video link
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          required
          placeholder="https://..."
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm text-foreground/70">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          pattern="[a-z0-9][a-z0-9-]{0,62}[a-z0-9]"
          title="Lowercase letters, numbers, and hyphens only"
          placeholder="auto-generated from video name"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="plannedDate" className="mb-1 block text-sm text-foreground/70">
          Planned date
        </label>
        <input id="plannedDate" name="plannedDate" type="date" className={inputClassName} />
      </div>
      <div>
        <label htmlFor="postedDate" className="mb-1 block text-sm text-foreground/70">
          Posted date
        </label>
        <input id="postedDate" name="postedDate" type="date" className={inputClassName} />
      </div>
      <div>
        <label htmlFor="fixedFee" className="mb-1 block text-sm text-foreground/70">
          Fixed fee
        </label>
        <input
          id="fixedFee"
          name="fixedFee"
          type="number"
          min="0"
          step="0.01"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="variableFee" className="mb-1 block text-sm text-foreground/70">
          Variable fee (CPM)
        </label>
        <input
          id="variableFee"
          name="variableFee"
          type="number"
          min="0"
          step="0.01"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="maxBudget" className="mb-1 block text-sm text-foreground/70">
          Max budget
        </label>
        <input
          id="maxBudget"
          name="maxBudget"
          type="number"
          min="0"
          step="0.01"
          placeholder="No cap"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="views" className="mb-1 block text-sm text-foreground/70">
          Views
        </label>
        <input
          id="views"
          name="views"
          type="number"
          min="0"
          step="1"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="likes" className="mb-1 block text-sm text-foreground/70">
          Likes
        </label>
        <input
          id="likes"
          name="likes"
          type="number"
          min="0"
          step="1"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="comments" className="mb-1 block text-sm text-foreground/70">
          Comments
        </label>
        <input
          id="comments"
          name="comments"
          type="number"
          min="0"
          step="1"
          defaultValue="0"
          className={inputClassName}
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Adding..." : "Add video"}
        </button>
      </div>
      {state.error ? <p className="lg:col-span-2 text-sm text-red-500">{state.error}</p> : null}
    </form>
  );
}
