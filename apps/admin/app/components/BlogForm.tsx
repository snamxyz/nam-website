"use client";

import { useActionState, useState } from "react";
import type { BlogActionState } from "../blog-actions";
import { createBlogPost, updateBlogPost } from "../blog-actions";
import CoverImageUpload from "./CoverImageUpload";
import TiptapEditor from "./TiptapEditor";

type BlogFormProps = {
  mode: "create" | "edit";
  defaultValues?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImageUrl: string | null;
    content: unknown;
    status: "DRAFT" | "PUBLISHED";
  };
};

const initialState: BlogActionState = {};

const inputClassName =
  "w-full rounded-lg border border-nam-border bg-white px-3 py-2 text-sm outline-none focus:border-nam-green";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export default function BlogForm({ mode, defaultValues }: BlogFormProps) {
  const action = mode === "create" ? createBlogPost : updateBlogPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const defaultContent = defaultValues?.content
    ? JSON.stringify(defaultValues.content)
    : undefined;

  return (
    <form action={formAction} className="max-w-3xl space-y-4">
      {mode === "edit" && defaultValues ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-foreground/70">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className={inputClassName}
          onChange={(event) => {
            if (!slugTouched) {
              setSlug(slugifyTitle(event.target.value));
            }
          }}
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm text-foreground/70">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          pattern="[a-z0-9][a-z0-9-]{0,62}[a-z0-9]"
          title="Lowercase letters, numbers, and hyphens only"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-foreground/50">
          Public URL: /blog/{slug || "your-slug"}
        </p>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-foreground/70">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={defaultValues?.description}
          placeholder="Short excerpt shown on the blog list page"
          className={inputClassName}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-foreground/70">Cover image</label>
        <CoverImageUpload defaultUrl={defaultValues?.coverImageUrl} />
      </div>

      <div>
        <label className="mb-1 block text-sm text-foreground/70">Content</label>
        <TiptapEditor name="content" defaultContent={defaultContent} />
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-sm text-foreground/70">
          Status
        </label>
        <select
          id="status"
          name="status"
          className={inputClassName}
          defaultValue={defaultValues?.status ?? "DRAFT"}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving..." : mode === "create" ? "Create post" : "Save changes"}
      </button>
    </form>
  );
}
