import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export type StorageBucket = 'avatars' | 'gallery' | 'blogs' | 'resources';

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to a Supabase Storage bucket.
 * Automatically ensures public URLs are returned.
 */
export async function uploadToSupabaseStorage(
  bucket: StorageBucket,
  path: string,
  fileBody: Buffer | Uint8Array | Blob | File,
  contentType?: string
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    // Graceful dev fallback if keys are placeholders
    return {
      success: true,
      publicUrl: `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${path}`,
      path,
    };
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage.from(bucket).upload(path, fileBody, {
      contentType: contentType || 'application/octet-stream',
      upsert: true,
    });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Supabase Storage] Failed to upload to ${bucket}:`, message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Delete a file from a Supabase Storage bucket.
 */
export async function deleteFromSupabaseStorage(
  bucket: StorageBucket,
  paths: string[]
): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`[Supabase Storage] Failed to delete from ${bucket}:`, error);
    return false;
  }
}
