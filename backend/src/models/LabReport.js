import mongoose from 'mongoose';

const testEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    result: { type: String, required: true },
    unit: { type: String },
    referenceRange: { type: String },
  },
  { _id: false }
);

const labReportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    category: { type: String, enum: ['Haematology', 'Urine', 'Biochemistry', 'Other'], required: true },
    tests: [testEntrySchema],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    notes: { type: String },
    reportedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('LabReport', labReportSchema);


