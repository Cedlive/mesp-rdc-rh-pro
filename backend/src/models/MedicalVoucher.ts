import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalVoucher extends Document {
  teacherId: mongoose.Types.ObjectId; // Lien vers l'agent
  teacherName: string;
  facilityName: string; // Hôpital ou Pharmacie
  type: 'Consultation' | 'Pharmacie' | 'Hospitalisation' | 'Laboratoire';
  amount: number;
  currency: 'USD' | 'CDF';
  status: 'Validé' | 'En attente' | 'Rejeté' | 'Utilisé';
  issuedBy: mongoose.Types.ObjectId; // Agent émetteur (Médecin Conseil ou RH)
  date: Date;
  notes?: string;
}

const MedicalVoucherSchema: Schema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  teacherName: { type: String, required: true },
  facilityName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Consultation', 'Pharmacie', 'Hospitalisation', 'Laboratoire'],
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'CDF'], default: 'USD' },
  status: { 
    type: String, 
    enum: ['Validé', 'En attente', 'Rejeté', 'Utilisé'],
    default: 'En attente'
  },
  issuedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IMedicalVoucher>('MedicalVoucher', MedicalVoucherSchema);