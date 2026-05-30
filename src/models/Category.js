import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  image: { type: String },
  icon: { type: String },
  metaTitle: String,
  metaDescription: String,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
