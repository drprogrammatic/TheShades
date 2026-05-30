import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, default: '' },
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

const DEFAULT_ADS_TXT = 'google.com, pub-3513014389949536, DIRECT, f08c47fec0942fa0';

export const dynamic = 'force-dynamic';

export async function GET() {
  let content = DEFAULT_ADS_TXT;

  try {
    await dbConnect();
    const setting = await Settings.findOne({ key: 'ads-txt' }).lean();
    if (setting?.value) content = setting.value;
  } catch {
    // fall back to default
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
