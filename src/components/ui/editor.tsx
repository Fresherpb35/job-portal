"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button"; // Adjust this path if needed

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editable: true,
    immediatelyRender: false, // ✅ Fix SSR hydration error
  });

  if (!editor) return null;

  return (
    <div className="bg-white border rounded-md p-4 space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run
}
        >
          Italic
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
      </div>

      {/* Editor content area */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] border border-gray-300 rounded-md p-3 focus:outline-none"
      />
    </div>
  );
};
