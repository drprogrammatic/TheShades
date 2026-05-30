import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  adminResponse: { type: String },
}, { timestamps: true });

// Auto-generate ticket number
TicketSchema.pre('validate', function(next) {
  if (!this.ticketNumber) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.ticketNumber = `TKT-${randomNum}`;
  }
  next();
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
