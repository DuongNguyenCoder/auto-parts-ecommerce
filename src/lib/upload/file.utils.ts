export function formatFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;

  return `${mb.toFixed(2)} MB`;
}

export function validateFileSize(file: File, maxSizeMB: number) {
  const maxBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxBytes;
}
