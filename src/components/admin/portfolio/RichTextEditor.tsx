import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const iconButton = (
    icon: React.ReactNode,
    action: () => void,
    isActive: boolean
  ) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={action}
      className={isActive ? 'bg-accent' : ''}
    >
      {icon}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-muted">
        {iconButton(<Bold className="h-4 w-4" />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {iconButton(<Italic className="h-4 w-4" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {iconButton(<UnderlineIcon className="h-4 w-4" />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}

        {iconButton(<List className="h-4 w-4" />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {iconButton(<ListOrdered className="h-4 w-4" />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}

        {iconButton(<Heading1 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
        {iconButton(<Heading2 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {iconButton(<Heading3 className="h-4 w-4" />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}

        {iconButton(<LinkIcon className="h-4 w-4" />, () => {
          const url = window.prompt('Enter a URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }, editor.isActive('link'))}

        {iconButton(<AlignLeft className="h-4 w-4" />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
        {iconButton(<AlignCenter className="h-4 w-4" />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
        {iconButton(<AlignRight className="h-4 w-4" />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}
        {iconButton(<AlignJustify className="h-4 w-4" />, () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }))}
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[200px]" />
    </div>
  );
};