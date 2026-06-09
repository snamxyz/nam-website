import Link from "next/link";
import BlogForm from "@/app/components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/blogs" className="text-sm text-foreground/60 hover:text-foreground">
          ← Back to blogs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New blog post</h1>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
