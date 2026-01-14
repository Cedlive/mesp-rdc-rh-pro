import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemConfig extends Document {
  companyName: string;
  splashLogoUrl: string | null;
  menuLogoUrl: string | null;
  loginLeftTitle: string;
  loginLeftDescription: string;
  loginLeftBgUrl: string;
  currentExchangeRate: number; // Taux de change officiel MESP (ex: 2500)
  themeColor: string;
  maintenanceMode: boolean;
}

const SystemConfigSchema: Schema = new Schema({
  companyName: { type: String, default: 'MESP-RDC' },
  splashLogoUrl: { type: String, default: null },
  menuLogoUrl: { type: String, default: null },
  loginLeftTitle: { type: String, default: 'Mutuelle de Santé des Enseignants' },
  loginLeftDescription: { type: String, default: 'Plateforme intégrée RH' },
  loginLeftBgUrl: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200' },
  currentExchangeRate: { type: Number, default: 2500 },
  themeColor: { type: String, default: 'blue' },
  // Fix: change 'boolean' type to 'Boolean' value for Mongoose schema definition
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);