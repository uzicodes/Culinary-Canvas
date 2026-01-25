import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  
  // Profile Picture
  profilePicture: { type: String, default: null },
  profilePictureUpdatedAt: { type: Date, default: null },
  
  // Forgot Password functionality
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);