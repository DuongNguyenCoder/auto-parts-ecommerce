"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { useCloudinaryUpload } from "../hooks/use-cloudinary-upload";

type Props = {
  folder?: string;
  onSuccess?: (result: CloudinaryUploadWidgetResults) => void;
  children: (props: { open: () => void }) => React.ReactNode;
};

export function CloudinaryUploadWidget({ folder, onSuccess, children }: Props) {
  // const { generateSignature } = useCloudinaryUpload({
  //   folder,
  // });

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        folder,
        multiple: false,
      }}
      onSuccess={(result) => {
        onSuccess?.(result);
      }}
    >
      {({ open }) => children({ open })}
    </CldUploadWidget>
  );
}
