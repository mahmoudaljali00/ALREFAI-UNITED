import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  tags?: string[];
  context?: Record<string, string>;
  transformation?: Array<Record<string, unknown>>;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

export async function uploadImage(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<{ publicId: string; url: string; width: number; height: number; format: string; bytes: number }> {
  const folder = options.folder || 'alrefai-united';
  const transformation = options.transformation || [
    { quality: 'auto:good', fetch_format: 'auto' },
    { width: 1920, height: 1080, crop: 'limit' },
  ];

  // Convert Buffer to base64 data URI if needed
  const fileToUpload = Buffer.isBuffer(file)
    ? `data:image/png;base64,${file.toString('base64')}`
    : file;

  const result = await cloudinary.uploader.upload(fileToUpload, {
    folder,
    public_id: options.public_id,
    tags: options.tags,
    context: options.context,
    transformation,
    resource_type: options.resource_type || 'image',
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function uploadMultipleImages(
  files: (Buffer | string)[],
  options: UploadOptions = {}
): Promise<Array<{ publicId: string; url: string; width: number; height: number; format: string; bytes: number }>> {
  const uploadPromises = files.map(file => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteImages(publicIds: string[]): Promise<void> {
  await Promise.all(publicIds.map(id => deleteImage(id)));
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: string;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
    gravity?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const transformations: Array<Record<string, unknown>> = [
    { quality, fetch_format: format },
  ];

  if (width || height) {
    transformations.push({ width, height, crop, gravity });
  }

  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
}

export function getResponsiveUrls(publicId: string, widths: number[] = [400, 800, 1200, 1600]): Record<number, string> {
  const urls: Record<number, string> = {};
  widths.forEach(width => {
    urls[width] = getOptimizedUrl(publicId, { width, crop: 'scale' });
  });
  return urls;
}

export async function createUploadPreset(name: string, folder: string): Promise<void> {
  await cloudinary.api.create_upload_preset({
    name,
    folder,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [
      { quality: 'auto:good', fetch_format: 'auto' },
      { width: 1920, height: 1080, crop: 'limit' },
    ],
  });
}

export async function getUsageStats(): Promise<{
  storage: { used_bytes: number; limit: number; used_percent: number };
  bandwidth: { used_bytes: number; limit: number; used_percent: number };
  requests: number;
  resources: number;
  derived_resources: number;
}> {
  const usage = await cloudinary.api.usage();
  return {
    storage: {
      used_bytes: usage.storage.used_bytes,
      limit: usage.storage.limit,
      used_percent: (usage.storage.used_bytes / usage.storage.limit) * 100,
    },
    bandwidth: {
      used_bytes: usage.bandwidth.used_bytes,
      limit: usage.bandwidth.limit,
      used_percent: (usage.bandwidth.used_bytes / usage.bandwidth.limit) * 100,
    },
    requests: usage.requests,
    resources: usage.resources,
    derived_resources: usage.derived_resources,
  };
}

export const FOLDERS = {
  HERO: 'alrefai-united/hero',
  SERVICES: 'alrefai-united/services',
  PROJECTS: 'alrefai-united/projects',
  PROJECTS_GALLERY: 'alrefai-united/projects/gallery',
  INDUSTRIES: 'alrefai-united/industries',
  TEAM: 'alrefai-united/team',
  CLIENTS: 'alrefai-united/clients',
  TESTIMONIALS: 'alrefai-united/testimonials',
  NEWS: 'alrefai-united/news',
  COMPANY: 'alrefai-united/company',
  GENERAL: 'alrefai-united/general',
} as const;

export const TRANSFORMATIONS = {
  THUMBNAIL: { width: 300, height: 200, crop: 'fill', gravity: 'auto', quality: 'auto:good', fetch_format: 'auto' },
  CARD: { width: 600, height: 400, crop: 'fill', gravity: 'auto', quality: 'auto:good', fetch_format: 'auto' },
  FEATURED: { width: 1200, height: 800, crop: 'fill', gravity: 'auto', quality: 'auto:good', fetch_format: 'auto' },
  HERO: { width: 1920, height: 1080, crop: 'fill', gravity: 'auto', quality: 'auto:good', fetch_format: 'auto' },
  AVATAR: { width: 150, height: 150, crop: 'thumb', gravity: 'face', quality: 'auto:good', fetch_format: 'auto' },
  LOGO: { width: 200, height: 200, crop: 'fit', quality: 'auto:good', fetch_format: 'auto' },
  OG_IMAGE: { width: 1200, height: 630, crop: 'fill', gravity: 'auto', quality: 'auto:good', fetch_format: 'auto' },
} as const;