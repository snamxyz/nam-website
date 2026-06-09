"use client";

import { useState } from "react";
import { uploadBlogImage } from "../blog-actions";

type CoverImageUploadProps = {
  defaultUrl?: string | null;
};

const inputClassName =
  "w-full rounded-lg border border-nam-border bg-white px-3 py-2 text-sm outline-none focus:border-nam-green";

export default function CoverImageUpload({ defaultUrl }: CoverImageUploadProps) {
  const [coverUrl, setCoverUrl] = useState(defaultUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "cover");

    const result = await uploadBlogImage({}, formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setCoverUrl(result.url);
    }

    setUploading(false);
    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="coverImageUrl" value={coverUrl} />
      {coverUrl ? (
        <div className="overflow-hidden rounded-lg border border-nam-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="Cover preview" className="h-48 w-full object-cover" />
        </div>
      ) : null}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => void handleFileChange(event)}
        disabled={uploading}
        className={inputClassName}
      />
      {uploading ? (
        <p className="text-xs text-foreground/50">Uploading...</p>
      ) : (
        <p className="text-xs text-foreground/50">
          JPEG, PNG, WebP, or GIF. Max 5 MB.
        </p>
      )}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
