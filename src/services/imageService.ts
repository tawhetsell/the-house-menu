import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';
import { db } from '@/db/database';
import type { RecipeImage } from '@/types/recipe';

const FULL_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

const THUMB_OPTIONS = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 600,
  useWebWorker: true,
};

const blobUrlCache = new Map<string, string>();

export async function storeImage(file: File): Promise<string> {
  const [fullBlob, thumbBlob] = await Promise.all([
    imageCompression(file, FULL_OPTIONS),
    imageCompression(file, THUMB_OPTIONS),
  ]);

  const id = nanoid();
  const image: RecipeImage = {
    id,
    blob: fullBlob,
    thumbnailBlob: thumbBlob,
    mimeType: fullBlob.type,
    createdAt: Date.now(),
  };

  await db.recipeImages.add(image);
  return id;
}

export async function loadImageUrl(imageId: string, thumbnail = false): Promise<string> {
  const cacheKey = `${imageId}-${thumbnail ? 'thumb' : 'full'}`;
  const cached = blobUrlCache.get(cacheKey);
  if (cached) return cached;

  const record = await db.recipeImages.get(imageId);
  if (!record) throw new Error(`Image ${imageId} not found`);

  const url = URL.createObjectURL(thumbnail ? record.thumbnailBlob : record.blob);
  blobUrlCache.set(cacheKey, url);
  return url;
}

export function revokeImageUrl(imageId: string): void {
  for (const suffix of ['-thumb', '-full']) {
    const key = `${imageId}${suffix}`;
    const url = blobUrlCache.get(key);
    if (url) {
      URL.revokeObjectURL(url);
      blobUrlCache.delete(key);
    }
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  revokeImageUrl(imageId);
  await db.recipeImages.delete(imageId);
}
