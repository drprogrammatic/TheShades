import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  shortDescription: { type: String },
  description: { type: String, required: true },
  features: [String],
  materials: [String],
  useCases: [String],
  faqs: [{
    question: String,
    answer: String
  }],
  images: [String],
  price: { type: String },
  featured: { type: Boolean, default: false },
  metaTitle: String,
  metaDescription: String,
  published: { type: Boolean, default: true },
  isB2B: { type: Boolean, default: false },
  aboutCollection: { type: String },
  specifications: [{
    key: String,
    value: String
  }],
  technicalSpecs: [{
    specKey: String,
    specValue: String
  }],
  motorizationOptions: [String],
  fabricDetails: { type: String }
}, { timestamps: true });

ProductSchema.index({ categorySlug: 1, published: 1, isB2B: 1 });
ProductSchema.index({ featured: 1, published: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
