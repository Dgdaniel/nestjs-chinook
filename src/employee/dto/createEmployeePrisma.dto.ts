import { z } from 'zod';

export const createEmployeePrismaSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: 'First Name is required' }),
    lastName: z.string().trim().min(1, { message: 'Last Name is required' }),
    title: z.string().trim().min(1, { message: 'Title is required' }),
    reportsTo: z.number().positive().nullish(), // accepte null et undefined
    hireDate: z.coerce.date({ message: 'Hire date is required' }),
    birthDate: z.coerce.date({ message: 'Birth date is required' }),
    address: z.string().trim().min(1, { message: 'Address is required' }),
    postalCode: z
      .string()
      .trim()
      .min(1, { message: 'Postal code is required' }),
    phone: z.string().trim().min(1, { message: 'Phone is required' }),
    fax: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .email(),

    city: z.string().trim().min(1, { message: 'City is required' }),
    state: z.string().trim().min(1, { message: 'State is required' }),
  })
  .required();

export type createEmployeePrismaDto = z.infer<typeof createEmployeePrismaSchema>;
