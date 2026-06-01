import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  speaker: { type: String },
  poster: { type: String },
  category: { type: String, required: true },
  seatLimit: { type: Number },
  isFeatured: { type: Boolean, default: false },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
