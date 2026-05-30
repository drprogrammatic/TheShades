import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { categories, products, blogPosts, adminUser } from './seedData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/theshades';

const ProductSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, category: String, categorySlug: String,
  shortDescription: String, description: String, features: [String], materials: [String],
  useCases: [String], faqs: [{ question: String, answer: String }], images: [String],
  price: String, featured: Boolean, metaTitle: String, metaDescription: String,
  published: { type: Boolean, default: true },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, description: String, shortDescription: String,
  image: String, icon: String, metaTitle: String, metaDescription: String,
  order: Number, published: { type: Boolean, default: true },
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, content: String, excerpt: String,
  featuredImage: String, tags: [String], metaTitle: String, metaDescription: String,
  published: Boolean, author: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String, role: String,
}, { timestamps: true });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await BlogPost.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Seed categories
    await Category.insertMany(categories);
    console.log(`Seeded ${categories.length} categories`);

    // Seed products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    // Seed blog posts
    await BlogPost.insertMany(blogPosts);
    console.log(`Seeded ${blogPosts.length} blog posts`);

    // Seed admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    await User.create({ ...adminUser, password: hashedPassword });
    console.log('Seeded admin user (admin@theshades.co.in / admin123)');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
