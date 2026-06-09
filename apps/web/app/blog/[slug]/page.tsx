import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogContent from "../../components/BlogContent";
import { getPublishedBlogPostBySlug } from "@nam/core/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post not found — NAM Rewards" };
  }

  return {
    title: `${post.title} — NAM Rewards Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) notFound();

  const publishedLabel = formatDate(post.publishedAt);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28">
        <article className="relative py-16 md:py-24 px-6">
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(1,210,67,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="text-sm text-foreground/50 hover:text-foreground transition"
            >
              ← Back to blog
            </Link>

            {post.coverImageUrl ? (
              <div className="mt-8 overflow-hidden rounded-3xl border border-nam-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImageUrl}
                  alt=""
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            ) : null}

            <header className={post.coverImageUrl ? "mt-10" : "mt-8"}>
              {publishedLabel ? (
                <p className="text-xs font-semibold tracking-widest uppercase text-nam-green mb-4">
                  {publishedLabel}
                </p>
              ) : null}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-foreground/55 leading-relaxed">
                {post.description}
              </p>
            </header>

            <div className="mt-10 glass rounded-3xl p-8 md:p-10">
              <BlogContent content={post.content} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
