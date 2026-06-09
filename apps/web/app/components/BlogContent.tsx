import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

type BlogContentProps = {
  content: unknown;
};

const extensions = [
  StarterKit,
  Image.configure({ inline: false }),
  Link.configure({ openOnClick: true }),
];

export default function BlogContent({ content }: BlogContentProps) {
  const html = generateHTML(content as Parameters<typeof generateHTML>[0], extensions);

  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
