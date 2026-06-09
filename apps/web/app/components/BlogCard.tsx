import Link from "next/link";
import type { BlogPostListItem } from "@nam/core/blog";

type BlogCardProps = {
  post: BlogPostListItem;
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const publishedLabel = formatDate(post.publishedAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group glass rounded-3xl overflow-hidden transition hover:border-nam-green/30"
    >
      <div className="aspect-[16/9] overflow-hidden bg-black/[0.04]">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-foreground/30">
            NAM Blog
          </div>
        )}
      </div>
      <div className="p-6 md:p-7">
        {publishedLabel ? (
          <p className="text-xs font-semibold tracking-widest uppercase text-nam-green mb-3">
            {publishedLabel}
          </p>
        ) : null}
        <h2 className="text-xl font-bold tracking-tight leading-snug group-hover:text-nam-green-deep transition">
          {post.title}
        </h2>
        <p className="mt-3 text-sm text-foreground/55 leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
