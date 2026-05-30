import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Simple key-value settings collection
const SettingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, default: '' },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

const DEFAULT_ADS_TXT = 'google.com, pub-3513014389949536, DIRECT, f08c47fec0942fa0';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const setting = await Settings.findOne({ key: 'ads-txt' }).lean();
    const content = setting?.value || DEFAULT_ADS_TXT;
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: DEFAULT_ADS_TXT });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { content } = await req.json();
    await Settings.findOneAndUpdate(
      { key: 'ads-txt' },
      { value: content || DEFAULT_ADS_TXT },
      { upsert: true, new: true }
    );
    return NextResponse.json({ message: 'ads.txt updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
