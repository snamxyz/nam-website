"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BlogPostStatus, Prisma } from "@nam/db/client";
import { isAdminAuthenticated } from "@nam/core/auth";
import { isBlogSlugTaken } from "@nam/core/blog";
import { isValidSlug } from "@nam/core/constants";
import { prisma } from "@nam/core/db";
import { sanitizeSlugSeed } from "@nam/core/profile";
import { uploadBlogImage as uploadToS3 } from "@nam/core/s3";

export type BlogActionState = {
  error?: string;
  success?: boolean;
  url?: string;
};

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  coverImageUrl: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z.nativeEnum(BlogPostStatus),
});

const updateBlogPostSchema = blogPostSchema.extend({
  id: z.string().min(1, "Post ID is required"),
});

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }
}

async function validateBlogSlug(slug: string, excludeId?: string) {
  if (!isValidSlug(slug)) {
    return "Slug must be 2-64 characters, lowercase letters, numbers, and hyphens only.";
  }

  if (await isBlogSlugTaken(slug, excludeId)) {
    return `Slug "${slug}" is already in use by another blog post.`;
  }

  return null;
}

async function ensureUniqueBlogSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  while (await isBlogSlugTaken(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function parseContent(content: string): Prisma.InputJsonValue {
  try {
    return JSON.parse(content) as Prisma.InputJsonValue;
  } catch {
    throw new Error("Invalid content format.");
  }
}

function resolvePublishedAt(
  status: BlogPostStatus,
  existingPublishedAt: Date | null,
): Date | null {
  if (status === BlogPostStatus.PUBLISHED) {
    return existingPublishedAt ?? new Date();
  }
  return null;
}

export async function uploadBlogImage(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  await requireAdmin();

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "cover");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No image file provided." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Image must be JPEG, PNG, WebP, or GIF." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be 5 MB or smaller." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToS3(
      buffer,
      file.type,
      folder === "content" ? "content" : "cover",
    );
    return { success: true, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return { error: message };
  }
}

export async function createBlogPost(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  await requireAdmin();

  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    description: formData.get("description"),
    coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim() || undefined,
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid blog post data" };
  }

  const requestedSlug = parsed.data.slug
    ? sanitizeSlugSeed(parsed.data.slug, "post")
    : sanitizeSlugSeed(parsed.data.title, "post");

  const slugError = parsed.data.slug
    ? await validateBlogSlug(requestedSlug)
    : null;

  if (slugError) return { error: slugError };

  const slug = parsed.data.slug
    ? requestedSlug
    : await ensureUniqueBlogSlug(requestedSlug);

  let content: Prisma.InputJsonValue;
  try {
    content = parseContent(parsed.data.content);
  } catch {
    return { error: "Invalid content format." };
  }

  const publishedAt = resolvePublishedAt(parsed.data.status, null);

  await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      content,
      status: parsed.data.status,
      publishedAt,
    },
  });

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function updateBlogPost(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  await requireAdmin();

  const parsed = updateBlogPostSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    description: formData.get("description"),
    coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim() || undefined,
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid blog post data" };
  }

  const existing = await prisma.blogPost.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existing) return { error: "Blog post not found." };

  const requestedSlug = parsed.data.slug
    ? sanitizeSlugSeed(parsed.data.slug, "post")
    : sanitizeSlugSeed(parsed.data.title, "post");

  const slugError = await validateBlogSlug(requestedSlug, parsed.data.id);
  if (slugError) return { error: slugError };

  let content: Prisma.InputJsonValue;
  try {
    content = parseContent(parsed.data.content);
  } catch {
    return { error: "Invalid content format." };
  }

  const publishedAt = resolvePublishedAt(parsed.data.status, existing.publishedAt);

  await prisma.blogPost.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      slug: requestedSlug,
      description: parsed.data.description,
      coverImageUrl: parsed.data.coverImageUrl ?? null,
      content,
      status: parsed.data.status,
      publishedAt,
    },
  });

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${parsed.data.id}/edit`);
  redirect("/blogs");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/blogs");
}
