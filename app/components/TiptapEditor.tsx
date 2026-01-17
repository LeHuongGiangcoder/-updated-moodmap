
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import React, { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Code 
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

const ToolbarButton = ({ 
  onClick, 
  isActive, 
  children 
}: { 
  onClick: () => void; 
  isActive: boolean; 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-zinc-700 transition-colors ${
      isActive ? 'bg-zinc-700 text-[var(--primary-green)]' : 'text-gray-400 hover:text-white'
    }`}
    type="button"
  >
    {children}
  </button>
);

const TiptapEditor = ({ content, onChange, editable = true }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write about your journey...',
      }),
    ],
    content: content,
    editable: editable,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[300px] px-4 py-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
       // Only update if content is completely different (like changing entries)
       // This is a simple check to avoid cursor jumping
       if (editor.getText() === '' && content !== '<p></p>') {
         editor.commands.setContent(content);
       } else if (content !== editor.getHTML()) {
         // If we are here, it means content changed from outside but editor has something else.
         // We should be careful. For now, let's trust the internal state more if it's focused.
         if (!editor.isFocused) {
            editor.commands.setContent(content);
         }
       }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-zinc-800 rounded-xl overflow-hidden bg-[#0b1016]/50">
      {/* Fixed Toolbar */}
      {editable && (
        <div className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 p-2 flex gap-1 flex-wrap sticky top-0 z-10">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
