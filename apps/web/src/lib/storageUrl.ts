/**
 * Public download URL for a file stored at `assets/{relativePath}` in Firebase Storage.
 * Requires storage rules to allow public read on `assets/**`.
 */
export function getStorageAssetUrl(relativePath: string): string {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error(
      "VITE_FIREBASE_STORAGE_BUCKET is not set — copy apps/web/.env.example to apps/web/.env",
    );
  }

  const objectPath = `assets/${relativePath.replace(/^\/+/, "")}`;
  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media`;
}
