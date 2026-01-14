import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string; // ex: 'UPDATE_PAYROLL', 'DELETE_EMPLOYEE'
  module: string; // ex: 'PAYROLL', 'MEDICAL', 'AUTH'
  details: string;
  ipAddress: string;
  userAgent: string;
}

const AuditLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);