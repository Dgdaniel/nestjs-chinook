import { Schema } from 'mongoose';

export const EmployeeSchema = new Schema({
  lastName: {
    type: String,
    required: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
  },
  reportsTo: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
  ],
  birthDate: {
    type: Date,
  },
  hireDate: {
    type: Date,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for full name
EmployeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
