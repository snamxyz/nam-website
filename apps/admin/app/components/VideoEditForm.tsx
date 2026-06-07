"use client";

import { useActionState } from "react";
import type { ActionState } from "../actions";
import { updateVideo } from "../actions";

const initialState: ActionState = {};

const inputClassName =
  "w-full rounded-lg border border-nam-border bg-black/40 px-3 py-2 text-sm outline-none focus:border-nam-green";

export type VideoEditDefaults = {
  videoId: string;
  campaignId: string;
  name: string;
  videoUrl: string;
  slug: string;
  plannedDate: string;
  postedDate: string;
  fixedFee: string;
  variableFee: string;
  maxBudget: string;
  views: number;
  likes: number;
  comments: number;
};

export default function VideoEditForm({ defaults }: { defaults: VideoEditDefaults }) {
  const [state, formAction, pending] = useActionState(updateVideo, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-nam-border bg-nam-card p-5 lg:grid-cols-2">
      <input type="hidden" name="videoId" value={defaults.videoId} />
      <input type="hidden" name="campaignId" value={defaults.campaignId} />
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-foreground/70">
          Video name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaults.name}
          className={inputClassName}
        />
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
          defaultValue={defaults.videoUrl}
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
          defaultValue={defaults.slug}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="plannedDate" className="mb-1 block text-sm text-foreground/70">
          Planned date
        </label>
        <input
          id="plannedDate"
          name="plannedDate"
          type="date"
          defaultValue={defaults.plannedDate}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="postedDate" className="mb-1 block text-sm text-foreground/70">
          Posted date
        </label>
        <input
          id="postedDate"
          name="postedDate"
          type="date"
          defaultValue={defaults.postedDate}
          className={inputClassName}
        />
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
          defaultValue={defaults.fixedFee}
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
          defaultValue={defaults.variableFee}
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
          defaultValue={defaults.maxBudget}
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
          defaultValue={defaults.views}
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
          defaultValue={defaults.likes}
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
          defaultValue={defaults.comments}
          className={inputClassName}
        />
      </div>
      <div className="flex items-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save video"}
        </button>
      </div>
      {state.error ? <p className="lg:col-span-2 text-sm text-red-400">{state.error}</p> : null}
    </form>
  );
}
