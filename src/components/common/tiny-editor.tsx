"use client";

import { useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useCloudinaryUpload } from "@/features/upload/hooks/use-cloudinary-upload";
import { toast } from "sonner";

const TinyMCEEditor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  { ssr: false },
);

interface TinyMCEEditorProps {
  initialValue?: string;
  height?: number;
  onChange?: (content: string) => void;
  disabled?: boolean;
  folder?: string;
}

export default function TinyEditor({
  initialValue = "",
  height = 700,
  onChange,
  disabled = false,
  folder,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);
  const { upload } = useCloudinaryUpload({
    folder,
  });

  const filePickerCallback = useCallback(
    (cb: any) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          const result = await upload(file);
          cb(result, { title: file.name });
        } catch (err) {
          console.error(err);
          toast.error("Upload ảnh thất bại");
        }
      };

      input.click();
    },
    [upload],
  );

  // memo để tránh re-init
  const editorConfig = useMemo(
    () => ({
      height,
      menubar: true,
      toolbar_sticky: true,

      plugins: [
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "pagebreak",
        "searchreplace",
        "wordcount",
        "visualblocks",
        "visualchars",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "emoticons",
        "help",
      ],

      toolbar:
        "undo redo | styles | bold italic | forecolor backcolor | " +
        "alignleft aligncenter alignright alignjustify | " +
        "bullist numlist | link image media | fullscreen code",

      content_style:
        "body { font-family:Arial,Helvetica,sans-serif; font-size:16px; line-height:1.6; }",

      automatic_uploads: true,
      file_picker_types: "image",
      file_picker_callback: filePickerCallback,

      image_title: true,
    }),
    [height, filePickerCallback],
  );

  return (
    <TinyMCEEditor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      initialValue={initialValue}
      onInit={(_, editor) => (editorRef.current = editor)}
      init={editorConfig}
      onEditorChange={(content) => onChange?.(content)}
      disabled={disabled}
    />
  );
}
