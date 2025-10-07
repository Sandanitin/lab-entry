import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    doctor: { type: String, trim: true },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);


