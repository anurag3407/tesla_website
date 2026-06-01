import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['General', 'Executive', 'Core', 'Faculty', 'Admin', 'Alumni'], 
    default: 'General' 
  },
  rollNo: { type: String },
  branch: { type: String },
  year: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  profileImage: { type: String, default: '' },
  isVerified: { type: Boolean, default: false }, // For Alumni / Role verification
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' }
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
