import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  locationIn: {
    lat: number;
    lng: number;
    address: string;
  };
  locationOut?: {
    lat: number;
    lng: number;
    address: string;
  };
  totalHours: number;
  status: 'Présent' | 'Retard' | 'Absent' | 'Mission';
}

const AttendanceSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  clockIn: { type: Date, required: true },
  clockOut: { type: Date },
  locationIn: {
    lat: Number,
    lng: Number,
    address: String
  },
  locationOut: {
    lat: Number,
    lng: Number,
    address: String
  },
  totalHours: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Présent', 'Retard', 'Absent', 'Mission'],
    default: 'Présent' 
  }
}, { timestamps: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);