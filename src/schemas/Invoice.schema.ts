import mongoose, { Types } from 'mongoose';
import { CUSTOMER_MODEL } from '../constants/object.constants';

export const InvoiceSchema = new mongoose.Schema(
  {
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (v: Date) {
          return v <= new Date();
        },
        message: 'Invoice date cannot be in the future',
      },
    },
    invoiceAddress: {
      type: String,
      trim: true,
    },
    billingAddress: {
      type: String,
      trim: true,
    },
    billingCity: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    billingState: {
      type: String,
      trim: true,
    },
    billingPostalCode: {
      type: String,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    customer: {
      type: Types.ObjectId,
      ref: CUSTOMER_MODEL,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

InvoiceSchema.index({ customer: 1, invoiceDate: -1 });
InvoiceSchema.index({ invoiceDate: -1 });