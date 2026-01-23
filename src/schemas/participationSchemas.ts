import { z } from 'zod';

export const participationIdParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

export const challengeIdParamSchema = z.object({
  id: z.string().min(1, 'Challenge ID is  required')
});

export const challengeSlugParamSchema = z.object({
  slug: z.string().min(1, 'Challenge ID is  required')
});
export const participationSlugParamSchema = z.object({
  slug: z.string().min(1, 'ID is required')
});

export const createParticipationBodySchema = z.object({
  submissionUrl: z.string().url('Must be a valid URL'),
  description: z.string().max(500, 'Description too long').optional()
});

export const updateParticipationBodySchema = z.object({
  submissionUrl: z.string().url('Must be a valid URL').optional(),
  description: z.string().max(500, 'Description too long').optional()
});
