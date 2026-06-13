'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Crown,
  Edit2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Trophy,
  Users,
  X
} from 'lucide-react';

type DashboardRole =
  | 'TeamMember'
  | 'TeamLeader'
  | 'President'
  | 'PI'
  | 'OfficeBearer'
  | 'Alumni';

type UserProfile = {
  name?: string;
  email?: string;
  role?: string;
  rollNo?: string;
  branch?: string;
  year?: string;
  bio?: string;
  portfolio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
};

type ProfileFormData = {
  name: string;
  rollNo: string;
  branch: string;
  year: string;
  bio: string;
  portfolio: string;
  skills: string[];
  linkedin: string;
  github: string;
  instagram: string;
};

type ProfileField = {
  label: string;
  value: ReactNode;
  wide?: boolean;
  multiline?: boolean;
};

type ProfileLinkField = {
  label: string;
  href?: string;
  emptyLabel: string;
};

type RoleActionCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  cta: string;
  meta?: string;
};

type RoleSection = {
  label: string;
  title: string;
  description: string;
  cards: RoleActionCard[];
};

const dashboardRoles: DashboardRole[] = [
  'TeamMember',
  'TeamLeader',
  'President',
  'PI',
  'OfficeBearer',
  'Alumni'
];

const roleSections: Record<DashboardRole, RoleSection> = {
  TeamMember: {
    label: 'TeamMember',
    title: 'Member Workspace',
    description:
      'Track your club contributions across content, events, resources, and achievements.',
    cards: [
      {
        title: 'My Blogs',
        description: 'Write, edit, and manage articles shared with the community.',
        href: '/dashboard/blogs',
        icon: FileText,
        cta: 'Open Blogs',
        meta: 'Publishing'
      },
      {
        title: 'My Events',
        description: 'Review registrations, reminders, and certificates.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Participation'
      },
      {
        title: 'My Resources',
        description: 'Upload study material and track resource usage.',
        href: '/dashboard/resources',
        icon: BookOpen,
        cta: 'Open Resources',
        meta: 'Sharing'
      },
      {
        title: 'My Achievements',
        description: 'Maintain verified wins, internships, and accomplishments.',
        href: '/dashboard/achievements',
        icon: Trophy,
        cta: 'Open Achievements',
        meta: 'Growth'
      }
    ]
  },
  TeamLeader: {
    label: 'TeamLeader',
    title: 'Team Leadership Workspace',
    description:
      'Keep your team aligned while continuing to manage your own dashboard activity.',
    cards: [
      {
        title: 'Team Dashboard',
        description: 'Review your team overview and leadership responsibilities.',
        href: '/dashboard/team',
        icon: Users,
        cta: 'Open Team Dashboard',
        meta: 'Team'
      },
      {
        title: 'My Events',
        description: 'Coordinate upcoming activities and track your registrations.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Coordination'
      },
      {
        title: 'My Resources',
        description: 'Share notes, guides, and team learning material.',
        href: '/dashboard/resources',
        icon: BookOpen,
        cta: 'Open Resources',
        meta: 'Support'
      },
      {
        title: 'My Blogs',
        description: 'Publish updates, technical notes, and team stories.',
        href: '/dashboard/blogs',
        icon: FileText,
        cta: 'Open Blogs',
        meta: 'Communication'
      }
    ]
  },
  President: {
    label: 'President',
    title: 'President Workspace',
    description:
      'Access leadership oversight while keeping personal contributions close at hand.',
    cards: [
      {
        title: 'Leadership',
        description: 'Open the shared leadership overview for club-level direction.',
        href: '/dashboard/leadership',
        icon: Crown,
        cta: 'Open Leadership',
        meta: 'Governance'
      },
      {
        title: 'My Events',
        description: 'Follow participation and upcoming club activity.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Programs'
      },
      {
        title: 'My Blogs',
        description: 'Publish announcements, reflections, and updates.',
        href: '/dashboard/blogs',
        icon: FileText,
        cta: 'Open Blogs',
        meta: 'Messaging'
      },
      {
        title: 'My Achievements',
        description: 'Keep personal milestones visible and verified.',
        href: '/dashboard/achievements',
        icon: Trophy,
        cta: 'Open Achievements',
        meta: 'Recognition'
      }
    ]
  },
  PI: {
    label: 'PI',
    title: 'PI Workspace',
    description:
      'Review leadership context and the knowledge activity tied to your profile.',
    cards: [
      {
        title: 'Leadership',
        description: 'Open the PI, President, and Office Bearer overview.',
        href: '/dashboard/leadership',
        icon: ShieldCheck,
        cta: 'Open Leadership',
        meta: 'Oversight'
      },
      {
        title: 'My Resources',
        description: 'Track educational resources shared through the club.',
        href: '/dashboard/resources',
        icon: BookOpen,
        cta: 'Open Resources',
        meta: 'Academics'
      },
      {
        title: 'My Events',
        description: 'Review event participation and certificates.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Engagement'
      },
      {
        title: 'My Achievements',
        description: 'Maintain verified academic and professional achievements.',
        href: '/dashboard/achievements',
        icon: Trophy,
        cta: 'Open Achievements',
        meta: 'Impact'
      }
    ]
  },
  OfficeBearer: {
    label: 'OfficeBearer',
    title: 'Office Bearer Workspace',
    description:
      'Manage your operating view across leadership, events, resources, and updates.',
    cards: [
      {
        title: 'Leadership',
        description: 'Open the shared leadership overview for office bearers.',
        href: '/dashboard/leadership',
        icon: Briefcase,
        cta: 'Open Leadership',
        meta: 'Operations'
      },
      {
        title: 'My Events',
        description: 'Track event responsibilities, registrations, and reminders.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Execution'
      },
      {
        title: 'My Resources',
        description: 'Maintain resources that support club members.',
        href: '/dashboard/resources',
        icon: BookOpen,
        cta: 'Open Resources',
        meta: 'Enablement'
      },
      {
        title: 'My Blogs',
        description: 'Share official updates and club activity posts.',
        href: '/dashboard/blogs',
        icon: FileText,
        cta: 'Open Blogs',
        meta: 'Updates'
      }
    ]
  },
  Alumni: {
    label: 'Alumni',
    title: 'Alumni Workspace',
    description:
      'Stay connected with the club while keeping your profile and contributions current.',
    cards: [
      {
        title: 'Alumni Hub',
        description: 'Open alumni activities, updates, and community touchpoints.',
        href: '/dashboard/alumni',
        icon: GraduationCap,
        cta: 'Open Alumni Hub',
        meta: 'Network'
      },
      {
        title: 'My Achievements',
        description: 'Showcase career milestones and verified accomplishments.',
        href: '/dashboard/achievements',
        icon: Trophy,
        cta: 'Open Achievements',
        meta: 'Career'
      },
      {
        title: 'My Blogs',
        description: 'Share experience, guidance, and alumni stories.',
        href: '/dashboard/blogs',
        icon: FileText,
        cta: 'Open Blogs',
        meta: 'Mentorship'
      },
      {
        title: 'My Events',
        description: 'Follow club events and alumni participation.',
        href: '/dashboard/events',
        icon: Calendar,
        cta: 'Open Events',
        meta: 'Connection'
      }
    ]
  }
};

const isDashboardRole = (role?: string): role is DashboardRole =>
  dashboardRoles.includes(role as DashboardRole);

const createFormDataFromUser = (profile: UserProfile): ProfileFormData => ({
  name: profile.name || '',
  rollNo: profile.rollNo || '',
  branch: profile.branch || '',
  year: profile.year || '',
  bio: profile.bio || '',
  portfolio: profile.portfolio || '',
  skills: profile.skills || [],
  linkedin: profile.socialLinks?.linkedin || '',
  github: profile.socialLinks?.github || '',
  instagram: profile.socialLinks?.instagram || ''
});

function InfoField({ label, value, wide, multiline }: ProfileField) {
  return (
    <div className={wide ? 'md:col-span-2' : undefined}>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
        {label}
      </label>
      <div
        className={`text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 ${
          multiline ? 'min-h-[100px]' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function LinkField({ label, href, emptyLabel }: ProfileLinkField) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
        {label}
      </label>
      <div className="text-white font-medium bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 truncate">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {href}
          </a>
        ) : (
          <span className="text-gray-400">{emptyLabel}</span>
        )}
      </div>
    </div>
  );
}

function RoleCard({ title, description, href, icon: Icon, cta, meta }: RoleActionCard) {
  return (
    <Link
      href={href}
      className="glass rounded-xl border border-white/5 p-5 flex flex-col gap-4 hover:border-primary/30 hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        {meta && (
          <span className="text-[11px] font-bold uppercase text-gray-500">
            {meta}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-6">{description}</p>
      </div>

      <span className="mt-auto text-sm font-semibold text-primary">
        {cta}
      </span>
    </Link>
  );
}

function RoleDashboardSection({ section }: { section: RoleSection }) {
  return (
    <section className="space-y-5">
      <div>
        <span className="text-xs font-bold uppercase text-primary">
          {section.label}
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">
          {section.title}
        </h2>
        <p className="text-gray-400 mt-2 max-w-3xl">
          {section.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {section.cards.map((card) => (
          <RoleCard key={`${section.label}-${card.title}`} {...card} />
        ))}
      </div>
    </section>
  );
}

export default function DashboardProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    rollNo: '',
    branch: '',
    year: '',
    bio: '',
    portfolio: '',
    skills: [],
    linkedin: '',
    github: '',
    instagram: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();

        if (data.success) {
          const nextUser = data.user as UserProfile;
          setUser(nextUser);
          setFormData(createFormDataFromUser(nextUser));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Update failed');
        return;
      }

      const updatedUser = data.user as UserProfile;
      setUser(updatedUser);
      setFormData(createFormDataFromUser(updatedUser));
      setEditOpen(false);
      alert('Profile Updated Successfully');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const basicInfoFields: ProfileField[] = [
    {
      label: 'Full Name',
      value: user?.name || 'Not Set'
    },
    {
      label: 'Email',
      value: user?.email || 'Not Set'
    },
    {
      label: 'Roll Number',
      value: user?.rollNo || 'Not Set'
    },
    {
      label: 'Branch / Year',
      value: `${user?.branch || 'Not Set'} / ${user?.year || 'Not Set'}`
    },
    {
      label: 'Bio',
      value: user?.bio || 'No bio added yet',
      wide: true,
      multiline: true
    }
  ];

  const linkFields: ProfileLinkField[] = [
    {
      label: 'Portfolio',
      href: user?.portfolio,
      emptyLabel: 'Link Not Added'
    },
    {
      label: 'LinkedIn',
      href: user?.socialLinks?.linkedin,
      emptyLabel: 'Not Added'
    },
    {
      label: 'GitHub',
      href: user?.socialLinks?.github,
      emptyLabel: 'Not Added'
    },
    {
      label: 'Instagram',
      href: user?.socialLinks?.instagram,
      emptyLabel: 'Not Added'
    }
  ];

  const roleSection = isDashboardRole(user?.role)
    ? roleSections[user.role]
    : null;

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">
          Manage your personal information and social links.
        </p>
      </div>

      {roleSection && <RoleDashboardSection section={roleSection} />}

      <div className="glass rounded-2xl border-white/5 p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden group">
            <img
              src="https://i.pravatar.cc/150?u=current_user"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="text-xs text-primary font-medium hover:underline">
            Remove Photo
          </button>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Basic Info</h2>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basicInfoFields.map((field) => (
              <InfoField key={field.label} {...field} />
            ))}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Skills / Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No skills added</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {linkFields.map((field) => (
              <LinkField key={field.label} {...field} />
            ))}
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-[#111827] rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Edit Profile
              </h2>

              <button
                onClick={() => setEditOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Close edit profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full Name"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                value={formData.rollNo}
                onChange={(e) =>
                  setFormData({ ...formData, rollNo: e.target.value })
                }
                placeholder="Roll Number"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                placeholder="Branch"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="Year"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Bio"
                className="w-full md:col-span-2 bg-white/5 border border-white/10 rounded-lg p-3 text-white min-h-[120px]"
              />

              <input
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                placeholder="Portfolio URL"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <div className="space-y-3">
                <label className="text-sm text-gray-300">Skills</label>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            skills: formData.skills.filter(
                              (_, i) => i !== index
                            )
                          });
                        }}
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && skillInput.trim()) {
                      e.preventDefault();

                      if (!formData.skills.includes(skillInput.trim())) {
                        setFormData({
                          ...formData,
                          skills: [...formData.skills, skillInput.trim()]
                        });
                      }

                      setSkillInput('');
                    }
                  }}
                  placeholder="Type skill and press Enter"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                />
              </div>

              <input
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="LinkedIn URL"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="GitHub URL"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <input
                value={formData.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="Instagram URL"
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-white"
              />

              <div className="flex justify-end gap-3 mt-6 md:col-span-2">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-primary rounded-lg text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
