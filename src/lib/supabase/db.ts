import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import type {
  IUser,
  IEvent,
  IBlog,
  IAchievement,
  IResource,
  IGallery,
  ITeam,
  ITeamProject,
} from '@/types/models';

/**
 * ── Data Mappers: PostgreSQL (snake_case) <-> Application (camelCase) ──────
 */

export function mapUserFromDb(row: Record<string, any>): IUser {
  return {
    _id: row.id,
    name: row.name || '',
    email: row.email || '',
    password: row.password,
    role: row.role || 'TeamMember',
    team: row.team || '',
    designation: row.designation || '',
    permissions: row.permissions || [],
    rollNo: row.roll_no || '',
    branch: row.branch || '',
    year: row.year || '',
    batch: row.batch,
    company: row.company || '',
    currentRole: row.current_role || '',
    graduationYear: row.graduation_year,
    location: row.location || '',
    bio: row.bio || '',
    profileImage: row.profile_image || '',
    portfolio: row.portfolio || '',
    resume: row.resume || '',
    phone: row.phone || '',
    availability: row.availability || '',
    currentSemester: row.current_semester,
    cgpa: row.cgpa || '',
    skills: row.skills || [],
    interests: row.interests || [],
    languages: row.languages || [],
    preferredDomains: row.preferred_domains || [],
    achievements: row.achievements || [],
    projects: row.projects || [],
    socialLinks: row.social_links || { linkedin: '', github: '', instagram: '', twitter: '' },
    isPublic: row.is_public ?? true,
    status: row.status || 'active',
    isVerified: row.is_verified ?? false,
    mustChangePassword: row.must_change_password ?? false,
    preferences: row.preferences || {
      emailNotifications: true,
      theme: 'dark',
      coverBanner: '',
      openToCollaboration: false,
    },
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapUserToDb(user: Partial<IUser>): Record<string, any> {
  const row: Record<string, any> = {};
  if (user.name !== undefined) row.name = user.name;
  if (user.email !== undefined) row.email = user.email.toLowerCase().trim();
  if (user.password !== undefined) row.password = user.password;
  if (user.role !== undefined) row.role = user.role;
  if (user.team !== undefined) row.team = user.team;
  if (user.designation !== undefined) row.designation = user.designation;
  if (user.permissions !== undefined) row.permissions = user.permissions;
  if (user.rollNo !== undefined) row.roll_no = user.rollNo;
  if (user.branch !== undefined) row.branch = user.branch;
  if (user.year !== undefined) row.year = user.year;
  if (user.batch !== undefined) row.batch = user.batch;
  if (user.company !== undefined) row.company = user.company;
  if (user.currentRole !== undefined) row.current_role = user.currentRole;
  if (user.graduationYear !== undefined) row.graduation_year = user.graduationYear;
  if (user.location !== undefined) row.location = user.location;
  if (user.bio !== undefined) row.bio = user.bio;
  if (user.profileImage !== undefined) row.profile_image = user.profileImage;
  if (user.portfolio !== undefined) row.portfolio = user.portfolio;
  if (user.resume !== undefined) row.resume = user.resume;
  if (user.phone !== undefined) row.phone = user.phone;
  if (user.availability !== undefined) row.availability = user.availability;
  if (user.currentSemester !== undefined) row.current_semester = user.currentSemester;
  if (user.cgpa !== undefined) row.cgpa = user.cgpa;
  if (user.skills !== undefined) row.skills = user.skills;
  if (user.interests !== undefined) row.interests = user.interests;
  if (user.languages !== undefined) row.languages = user.languages;
  if (user.preferredDomains !== undefined) row.preferred_domains = user.preferredDomains;
  if (user.achievements !== undefined) row.achievements = user.achievements;
  if (user.projects !== undefined) row.projects = user.projects;
  if (user.socialLinks !== undefined) row.social_links = user.socialLinks;
  if (user.isPublic !== undefined) row.is_public = user.isPublic;
  if (user.status !== undefined) row.status = user.status;
  if (user.isVerified !== undefined) row.is_verified = user.isVerified;
  if (user.mustChangePassword !== undefined) row.must_change_password = user.mustChangePassword;
  if (user.preferences !== undefined) row.preferences = user.preferences;
  return row;
}

export function mapEventFromDb(row: Record<string, any>): IEvent {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    date: row.date ? new Date(row.date) : new Date(),
    venue: row.venue,
    speaker: row.speaker || '',
    poster: row.poster || '',
    category: row.category,
    seatLimit: row.seat_limit,
    isFeatured: row.is_featured ?? false,
    registeredUsers: row.registered_users || [],
    waitlist: row.waitlist || [],
    approvalStatus: row.approval_status || 'approved',
    requestedBy: row.requested_by,
    requestNote: row.request_note || '',
    adminRemarks: row.admin_remarks || '',
    submittedAt: row.submitted_at ? new Date(row.submitted_at) : null,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapBlogFromDb(row: Record<string, any>): IBlog {
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    author: row.author_id,
    category: row.category,
    coverImage: row.cover_image || '',
    isFeatured: row.is_featured ?? false,
    status: row.status || 'Draft',
    likes: row.likes || [],
    views: row.views || 0,
    tags: row.tags || [],
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapAchievementFromDb(row: Record<string, any>): IAchievement {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    teamMembers: row.team_members || [],
    coverImage: row.cover_image,
    gallery: row.gallery || [],
    venue: row.venue || '',
    achievementDate: row.achievement_date ? new Date(row.achievement_date) : new Date(),
    organizer: row.organizer || '',
    tags: row.tags || [],
    eventLink: row.event_link || '',
    isFeatured: row.is_featured ?? false,
    status: row.status || 'Pending',
    uploadedBy: row.uploaded_by,
    uploaderName: row.uploader_name || '',
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapResourceFromDb(row: Record<string, any>): IResource {
  return {
    _id: row.id,
    department: row.department,
    semester: row.semester,
    subjectName: row.subject_name,
    subjectCode: row.subject_code || '',
    files: row.files || [],
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapGalleryFromDb(row: Record<string, any>): IGallery {
  return {
    _id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    mediaUrl: row.media_url || '',
    album: row.album,
    caption: row.caption || '',
    mediaType: row.media_type || 'Photo',
    uploadSource: row.upload_source || 'Direct',
    views: row.views || 0,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

export function mapTeamFromDb(row: Record<string, any>): ITeam {
  return {
    _id: row.id,
    name: row.name,
    description: row.description || '',
    coverImage: row.cover_image || '',
    lead: row.lead_id,
    members: row.members || [],
    isActive: row.is_active ?? true,
    createdBy: row.created_by,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
  };
}

/**
 * ── Supabase Database Services ───────────────────────────────────────────────
 */
export const supabaseDb = {
  users: {
    async findOne(filter: { email?: string; id?: string }) {
      if (!isSupabaseConfigured) return null;
      const supabase = getSupabaseAdmin();
      let query = supabase.from('users').select('*');
      if (filter.email) query = query.eq('email', filter.email.toLowerCase().trim());
      if (filter.id) query = query.eq('id', filter.id);
      const { data, error } = await query.maybeSingle();
      if (error || !data) return null;
      return mapUserFromDb(data);
    },
    async create(user: Partial<IUser>) {
      if (!isSupabaseConfigured) return null;
      const supabase = getSupabaseAdmin();
      const row = mapUserToDb(user);
      const { data, error } = await supabase.from('users').insert([row]).select().single();
      if (error || !data) throw error;
      return mapUserFromDb(data);
    },
  },
  events: {
    async find(options: { isFeatured?: boolean; approvalStatus?: string; limit?: number } = {}) {
      if (!isSupabaseConfigured) return [];
      const supabase = getSupabaseAdmin();
      let query = supabase.from('events').select('*').order('date', { ascending: true });
      if (options.approvalStatus) query = query.eq('approval_status', options.approvalStatus);
      if (options.isFeatured !== undefined) query = query.eq('is_featured', options.isFeatured);
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error || !data) return [];
      return data.map(mapEventFromDb);
    },
  },
  blogs: {
    async findPublished(options: { category?: string; search?: string; limit?: number } = {}) {
      if (!isSupabaseConfigured) return [];
      const supabase = getSupabaseAdmin();
      let query = supabase.from('blogs').select('*').eq('status', 'Published').order('created_at', { ascending: false });
      if (options.category && options.category !== 'all') query = query.eq('category', options.category);
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error || !data) return [];
      return data.map(mapBlogFromDb);
    },
  },
  visits: {
    async track(path: string = '/') {
      if (!isSupabaseConfigured) return;
      const supabase = getSupabaseAdmin();
      await supabase.from('visits').insert([{ path }]);
    },
  },
};
