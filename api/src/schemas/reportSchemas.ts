import { z } from 'zod';

export const createReportSchema = z.object({
  targetType: z.enum(['CHALLENGE', 'PARTICIPATION'], {
    required_error: 'Target type is required',
    invalid_type_error: 'Target type must be CHALLENGE or PARTICIPATION'
  }),
  targetId: z.string({
    required_error: 'Target ID is required'
  }).min(1, 'Target ID cannot be empty'),
  reason: z.string({
    required_error: 'Reason is required'
  }).min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters')
});

export type CreateReportInput = z.infer<typeof createReportSchema>;