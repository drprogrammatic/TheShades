import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import { categories, products, blogPosts, adminUser } from '@/lib/seedData';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await dbConnect();

    await Product.deleteMany({});
    await Category.deleteMany({});
    await BlogPost.deleteMany({});
    await User.deleteMany({});

    await Category.insertMany(categories);
    await Product.insertMany(products);
    await BlogPost.insertMany(blogPosts);

    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    await User.create({ ...adminUser, password: hashedPassword });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        categories: categories.length,
        products: products.length,
        blogPosts: blogPosts.length,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
