export type Locale = 'ar' | 'en';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOData {
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  ogTitleAr?: string;
  ogTitleEn?: string;
  ogDescriptionAr?: string;
  ogDescriptionEn?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  structuredData?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface CompanyInfo {
  nameAr: string;
  nameEn: string;
  taglineAr?: string;
  taglineEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  visionAr?: string;
  visionEn?: string;
  missionAr?: string;
  missionEn?: string;
  foundedYear?: number;
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
  ogImage?: string;
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
  latitude?: number;
  longitude?: number;
  mapEmbedUrl?: string;
}

export interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  seo?: SEOData;
}

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  category: string;
  locationAr?: string;
  locationEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  completionDate?: Date;
  startDate?: Date;
  budget?: string;
  area?: string;
  clientAr?: string;
  clientEn?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  mainImage?: string;
  gallery?: ProjectImage[];
  seo?: SEOData;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  altAr?: string;
  altEn?: string;
  captionAr?: string;
  captionEn?: string;
  displayOrder: number;
}

export interface Industry {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  seo?: SEOData;
}

export interface TeamMember {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  bioAr?: string;
  bioEn?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  displayOrder: number;
  isActive: boolean;
  featured: boolean;
}

export interface Client {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  website?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
  featured: boolean;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  positionAr: string;
  positionEn: string;
  companyAr?: string;
  companyEn?: string;
  contentAr: string;
  contentEn: string;
  image?: string;
  rating: number;
  isActive: boolean;
  featured: boolean;
  displayOrder: number;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  color?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Post {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr?: string;
  excerptEn?: string;
  contentAr: string;
  contentEn: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  metaTitleAr?: string;
  metaTitleEn?: string;
  metaDescriptionAr?: string;
  metaDescriptionEn?: string;
  ogImage?: string;
  viewCount: number;
  authorId?: string;
  categoryId?: string;
  category?: Category;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  assignedToId?: string;
  repliedAt?: Date;
  repliedById?: string;
  createdAt: Date;
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId?: string;
  folder?: string;
  altAr?: string;
  altEn?: string;
  width?: number;
  height?: number;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  labelAr?: string;
  labelEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isPublic: boolean;
}

export interface Statistic {
  id: string;
  labelAr: string;
  labelEn: string;
  value: string;
  suffix?: string;
  prefix?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  animate: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  nameAr: string;
  nameEn: string;
  url: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
}

export interface Value {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FeaturedProject {
  id: string;
  projectId: string;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  backgroundImage?: string;
  ctaTextAr?: string;
  ctaTextEn?: string;
  ctaLink?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalClients: number;
  unreadMessages: number;
  publishedArticles: number;
  websiteVisits: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export type ProjectCategory = 'construction' | 'engineering' | 'infrastructure' | 'commercial' | 'industrial' | 'other';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';