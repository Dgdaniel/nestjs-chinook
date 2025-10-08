import { z } from 'zod';

export const createCustomerSchema = z.object({
  firstName: z.string().max(40),
  lastName: z.string().max(20),
  company: z.string().max(80).optional(),
  address: z.string().max(70).optional(),
  city: z.string().max(40).optional(),
  state: z.string().max(40).optional(),
  country: z.string().max(40).optional(),
  postalCode: z.string().max(10).optional(),
  phone: z.string().max(24).optional(),
  fax: z.string().max(24).optional(),
  email: z.string().email().max(60),
  supportRep: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(), // MongoDB ObjectId
}).required();

export type createCustomerDto = z.infer<typeof createCustomerSchema>;