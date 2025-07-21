"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none",
      },
    },
    injectCSS: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
    // 👇 this line avoids SSR hydration issues
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="bg-white border rounded-md p-4">
      <EditorContent editor={editor} />
    </div>
  );
};
