import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, default: 1 },
    dimensions: String,
    notes: String
  }],
  status: { 
    type: String, 
    enum: ['Pending Quote', 'Quoted', 'Accepted', 'In Production', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending Quote'
  },
  quoteAmount: { type: Number },
  billUrl: { type: String }, // URL to PDF invoice
  notes: { type: String }, // Admin notes or customer special requests
}, { timestamps: true });

// Auto-generate order number before saving if not present
OrderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${randomNum}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
