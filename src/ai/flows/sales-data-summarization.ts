'use server';
/**
 * @fileOverview A sales data summarization AI agent.
 *
 * - summarizeSalesData - A function that handles the sales data summarization process.
 * - SummarizeSalesDataInput - The input type for the summarizeSalesData function.
 * - SummarizeSalesDataOutput - The return type for the summarizeSalesData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSalesDataInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'The sales data to summarize. Should include relevant information such as product names, quantities sold, revenue, dates, and customer demographics.'
    ),
  summaryLength: z
    .enum(['short', 'medium', 'long'])
    .default('medium')
    .describe('The desired length of the summary.'),
});
export type SummarizeSalesDataInput = z.infer<typeof SummarizeSalesDataInputSchema>;

const SummarizeSalesDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the sales data.'),
});
export type SummarizeSalesDataOutput = z.infer<typeof SummarizeSalesDataOutputSchema>;

export async function summarizeSalesData(input: SummarizeSalesDataInput): Promise<SummarizeSalesDataOutput> {
  return summarizeSalesDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSalesDataPrompt',
  input: {schema: SummarizeSalesDataInputSchema},
  output: {schema: SummarizeSalesDataOutputSchema},
  prompt: `You are a sales data analysis expert.  You will generate a summary of sales data.

      The length of the summary should be {{summaryLength}}.

      Sales data: {{{salesData}}}
      `,
});

const summarizeSalesDataFlow = ai.defineFlow(
  {
    name: 'summarizeSalesDataFlow',
    inputSchema: SummarizeSalesDataInputSchema,
    outputSchema: SummarizeSalesDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
