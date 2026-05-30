import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  featuredImage: { type: String },
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  published: { type: Boolean, default: false },
  author: { type: String, default: 'The Shades Team' },
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
