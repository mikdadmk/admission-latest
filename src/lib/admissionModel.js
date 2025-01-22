import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  motherName: String,
  guardianName: String,
  relation: String,
  address: String,
  dob: Date,
  phone: String,
  whatsapp: String,
  aadhaar: String,
  tc: String,
  pupilPhoto: String,
  signature: String,
  studiedBefore: String,
  prevInstitute: String,
  studyYears: Number,
  lastMadrassaClass: String,
  lastSchoolClass: String
});

const Admission = mongoose.models.Admission || mongoose.model('Admission', admissionSchema);

export default Admission;
