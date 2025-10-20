'use server';

import { summarizeSalesData } from '@/ai/flows/sales-data-summarization';
import { z } from 'zod';

const GenerateSummarySchema = z.object({
  salesData: z.string().min(1, 'Sales data cannot be empty.'),
  summaryLength: z.enum(['short', 'medium', 'long']),
});

export async function generateSummaryAction(prevState: any, formData: FormData) {
  const validatedFields = GenerateSummarySchema.safeParse({
    salesData: formData.get('salesData'),
    summaryLength: formData.get('summaryLength'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      summary: '',
    };
  }

  try {
    const result = await summarizeSalesData(validatedFields.data);
    return {
      message: 'Summary generated successfully.',
      summary: result.summary,
      errors: {},
    };
  } catch (error) {
    return {
      message: 'Failed to generate summary.',
      summary: '',
      errors: {},
    };
  }
}
