import { Schema } from 'mongoose';
import { EMPLOYEE_MODEL } from '../constants/object.constants';

export const CustomerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 40,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
    },
    company: {
      type: String,
      maxlength: 80,
      trim: true,
    },
    address: {
      type: String,
      maxlength: 70,
      trim: true,
    },
    city: {
      type: String,
      maxlength: 40,
      trim: true,
    },
    state: {
      type: String,
      maxlength: 40,
      trim: true,
    },
    country: {
      type: String,
      maxlength: 40,
      trim: true,
    },
    postalCode: {
      type: String,
      maxlength: 10,
      trim: true,
    },
    phone: {
      type: String,
      maxlength: 24,
      trim: true,
    },
    fax: {
      type: String,
      maxlength: 24,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 60,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    supportRep: {
      type: Schema.Types.ObjectId,
      ref: EMPLOYEE_MODEL,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index pour améliorer les performances
CustomerSchema.index({ email: 1 }, { unique: true });
CustomerSchema.index({ lastName: 1, firstName: 1 });
CustomerSchema.index({ supportRep: 1 });
CustomerSchema.index({ country: 1, city: 1 });

// Méthode virtuelle pour le nom complet
CustomerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
