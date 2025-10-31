import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  // Add other fields as needed
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);