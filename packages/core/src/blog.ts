import { BlogPostStatus } from "@nam/db/client";
import { prisma } from "./db";

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

export type BlogPostDetail = BlogPostListItem & {
  content: unknown;
};

export async function getPublishedBlogPosts(): Promise<BlogPostListItem[]> {
  return prisma.blogPost.findMany({
    where: { status: BlogPostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  return prisma.blogPost.findFirst({
    where: { slug, status: BlogPostStatus.PUBLISHED },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImageUrl: true,
      publishedAt: true,
      content: true,
    },
  });
}

export async function isBlogSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return false;
  if (excludeId && post.id === excludeId) return false;
  return true;
}

export async function getAllBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}
