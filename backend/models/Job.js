const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time',
    },
    location: { type: String, required: true },
    salary: { type: String, default: 'Not disclosed' },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    applicationDeadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
