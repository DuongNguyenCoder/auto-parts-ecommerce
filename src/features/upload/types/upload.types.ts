export type CloudinaryUploadResult = {
  asset_id: string;
  public_id: string;

  secure_url: string;

  width: number;
  height: number;

  format: string;
  bytes: number;

  created_at: string;
};

export type UploadImageDialogProps = {
  open?: boolean;

  onOpenChange?: (open: boolean) => void;

  title?: string;

  description?: string;

  folder?: string;

  maxSizeMB?: number;

  onSuccess?: (result: CloudinaryUploadResult) => void;
};
