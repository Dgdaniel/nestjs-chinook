import { Types } from 'mongoose';
import { z } from 'zod';

// Create Invoice DTO (sans ID)
export const CreateInvoiceSchema = z.object({
  invoiceDate: z
    .date()
    .or(z.string().datetime())
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = typeof val === 'string' ? new Date(val) : val;
        return date <= new Date();
      },
      { message: 'Invoice date cannot be in the future' }
    ),
  invoiceAddress: z.string().trim().optional(),
  billingAddress: z.string().trim().optional(),
  billingCity: z.string().trim().optional(),
  billingState: z.string().trim().optional(),
  billingPostalCode: z.string().trim().optional(),
  total: z.number().min(0, 'Total must be greater than or equal to 0'),
  customerId: z.string()
    .trim()
    .refine(
      val => Types.ObjectId.isValid(val),
      {
        message: 'Customer ID is invalid',
      }
    )
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;