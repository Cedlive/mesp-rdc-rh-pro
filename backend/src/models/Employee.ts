import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'Administrateur' | 'Directeur RH' | 'Responsable RH' | 'Employé' | 'Comptable' | 'Médecin Conseil';
  department: string;
  affiliation: string; // SEP (ex: SEP Kinshasa)
  insuranceNumber: string; // Matricule MESP
  phone: string;
  avatar: string;
  status: 'Actif' | 'En Congé' | 'Mission' | 'Inactif';
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Prestataire' | 'Détaché';
  sex: 'Masculin' | 'Féminin';
  cnssNumber?: string;
  bloodGroup?: string;
  bankName?: string;
  bankAccountNumber?: string;
  joinDate: Date;
  lastLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
    address: string;
    signalStrength: 'strong' | 'medium' | 'weak';
  };
}

const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['Administrateur', 'Directeur RH', 'Responsable RH', 'Employé', 'Comptable', 'Médecin Conseil'],
    default: 'Employé' 
  },
  department: { type: String, required: true },
  affiliation: { type: String, required: true }, // Rattachement SEP
  insuranceNumber: { type: String, required: true, unique: true },
  phone: { type: String },
  avatar: { type: String },
  status: { 
    type: String, 
    enum: ['Actif', 'En Congé', 'Mission', 'Inactif'], 
    default: 'Inactif' 
  },
  contractType: { type: String, enum: ['CDI', 'CDD', 'Stage', 'Prestataire', 'Détaché'] },
  sex: { type: String, enum: ['Masculin', 'Féminin'] },
  cnssNumber: { type: String },
  bloodGroup: { type: String },
  bankName: { type: String },
  bankAccountNumber: { type: String },
  joinDate: { type: Date, default: Date.now },
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: String,
    address: String,
    signalStrength: { type: String, enum: ['strong', 'medium', 'weak'] }
  }
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);