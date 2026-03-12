import { useState, useEffect } from 'react';
import { loadImageUrl, revokeImageUrl } from '@/services/imageService';

export function useRecipeImage(imageId: string | undefined, thumbnail = false): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) {
      setUrl(null);
      return;
    }

    let cancelled = false;
    loadImageUrl(imageId, thumbnail).then((loadedUrl) => {
      if (!cancelled) setUrl(loadedUrl);
    });

    return () => {
      cancelled = true;
      if (imageId) revokeImageUrl(imageId);
    };
  }, [imageId, thumbnail]);

  return url;
}
