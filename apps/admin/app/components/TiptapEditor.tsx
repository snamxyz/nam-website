"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";
import { uploadBlogImage } from "../blog-actions";

type TiptapEditorProps = {
  name: string;
  defaultContent?: string;
};

const toolbarButtonClass =
  "rounded px-2 py-1 text-sm text-foreground/70 transition hover:bg-black/[0.06] hover:text-foreground disabled:opacity-40";

export default function TiptapEditor({ name, defaultContent }: TiptapEditorProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your blog post..." }),
    ],
    content: defaultContent ? JSON.parse(defaultContent) : undefined,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = JSON.stringify(ed.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(editor.getJSON());
    }
  }, [editor]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "content");

      const result = await uploadBlogImage({}, formData);
      if (result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      }
    },
    [editor],
  );

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-nam-border bg-white">
      <div className="flex flex-wrap gap-1 border-b border-nam-border px-2 py-2">
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered list
        </button>
        <button type="button" className={toolbarButtonClass} onClick={setLink}>
          Link
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => fileInputRef.current?.click()}
        >
          Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImageUpload(file);
            event.target.value = "";
          }}
        />
      </div>
      <EditorContent
        editor={editor}
        className="prose-editor min-h-[280px] px-4 py-3 text-sm [&_.ProseMirror]:min-h-[260px] [&_.ProseMirror]:outline-none"
      />
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue="" />
    </div>
  );
}
