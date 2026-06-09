import Link from "next/link";
import { deleteBlogPost } from "@/app/blog-actions";
import { getAllBlogPosts } from "@nam/core/blog";
import { BlogPostStatus } from "@nam/db/client";

function statusBadge(status: BlogPostStatus) {
  if (status === BlogPostStatus.PUBLISHED) {
    return (
      <span className="rounded-full bg-nam-green/15 px-2 py-0.5 text-xs font-medium text-nam-green">
        Published
      </span>
    );
  }
  return (
    <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs font-medium text-foreground/60">
      Draft
    </span>
  );
}

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blogs</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Create and manage blog posts for the public site.
          </p>
        </div>
        <Link
          href="/blogs/new"
          className="rounded-lg bg-nam-green px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
        >
          New post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-nam-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-nam-border bg-black/[0.04] text-foreground/70">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">
                  No blog posts yet. Create your first post to get started.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-nam-border/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/blogs/${post.id}/edit`}
                      className="font-medium text-nam-green hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{post.slug}</td>
                  <td className="px-4 py-3">{statusBadge(post.status)}</td>
                  <td className="px-4 py-3">
                    {post.publishedAt?.toLocaleDateString() ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {post.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/blogs/${post.id}/edit`}
                        className="text-foreground/70 hover:text-foreground"
                      >
                        Edit
                      </Link>
                      <form action={deleteBlogPost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button
                          type="submit"
                          className="text-red-500/80 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
