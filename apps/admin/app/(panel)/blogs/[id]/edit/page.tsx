import Link from "next/link";
import { notFound } from "next/navigation";
import BlogForm from "@/app/components/BlogForm";
import { getBlogPostById } from "@nam/core/blog";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/blogs" className="text-sm text-foreground/60 hover:text-foreground">
          ← Back to blogs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Edit blog post</h1>
      </div>
      <BlogForm
        mode="edit"
        defaultValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description,
          coverImageUrl: post.coverImageUrl,
          content: post.content,
          status: post.status,
        }}
      />
    </div>
  );
}
