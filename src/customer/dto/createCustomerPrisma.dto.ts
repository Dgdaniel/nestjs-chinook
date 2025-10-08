import { z } from 'zod';

export const createCustomerPrismaSchema = z.object({
  firstName: z.string().max(40),
  lastName: z.string().max(20),
  company: z.string().max(80).nullish(),
  address: z.string().max(70).nullish(),
  city: z.string().max(40).nullish(),
  state: z.string().max(40).nullish(),
  country: z.string().max(40).nullish(),
  postalCode: z.string().max(10).nullish(),
  phone: z.string().max(24).nullish(),
  fax: z.string().max(24).nullish(),
  email: z.string().email().max(60),
  supportRepId: z.number().positive().nullish(),
});

export type createCustomerPrismaDto = z.infer<typeof createCustomerPrismaSchema>;