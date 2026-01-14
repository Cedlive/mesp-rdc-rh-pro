import mongoose, { Schema, Document } from 'mongoose';

export interface IPayrollRecord extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: string;
  year: number;
  baseSalaryCDF: number;
  primeUSD: number;
  primeCDF: number;
  missionFeeUSD: number;
  missionFeeCDF: number;
  fuelFeeCDF: number;
  maintenanceFeeCDF: number;
  operatingFeeUSD: number;
  totalCDF: number;
  totalUSD: number;
  exchangeRateUsed: number;
  status: 'Payé' | 'En attente' | 'Brouillon';
  validatedBy?: mongoose.Types.ObjectId;
}

const PayrollSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  baseSalaryCDF: { type: Number, default: 0 },
  primeUSD: { type: Number, default: 0 },
  primeCDF: { type: Number, default: 0 },
  missionFeeUSD: { type: Number, default: 0 },
  missionFeeCDF: { type: Number, default: 0 },
  fuelFeeCDF: { type: Number, default: 0 },
  maintenanceFeeCDF: { type: Number, default: 0 },
  operatingFeeUSD: { type: Number, default: 0 },
  totalCDF: { type: Number, required: true },
  totalUSD: { type: Number, required: true },
  exchangeRateUsed: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Payé', 'En attente', 'Brouillon'], 
    default: 'Brouillon' 
  },
  validatedBy: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

// Index pour éviter les doublons de paie pour un même agent le même mois
PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayrollRecord>('Payroll', PayrollSchema);