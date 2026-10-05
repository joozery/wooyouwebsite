export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif",
};
export function validateUpload(type: unknown, size: unknown) {
  if (typeof type !== "string" || !Object.hasOwn(imageExtensions, type)) return "รองรับรูป JPG, PNG, WebP และ AVIF";
  if (typeof size !== "number" || !Number.isInteger(size) || size <= 0 || size > MAX_IMAGE_BYTES) return "รูปภาพต้องมีขนาดไม่เกิน 10 MB";
  return null;
}
