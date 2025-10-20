'use server';
/**
 * @fileOverview An AI agent that generates a sales report based on provided data.
 *
 * - generateSalesReport - A function to generate a sales report.
 * - GenerateSalesReportInput - Input type for the generateSalesReport function.
 * - GenerateSalesReportOutput - Output type for the generateSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'The sales data to be analyzed and included in the report.  Include product names, quantities, revenue, dates, customer demographics, and any other relevant information.'
    ),
  reportType: z
    .enum(['summary', 'detailed'])
    .default('summary')
    .describe('The type of report to generate: summary or detailed.'),
  timePeriod: z
    .string()
    .describe('The time period the report should cover (e.g., last month, last quarter, last year).'),
  format: z
    .enum(['text', 'markdown'])
    .default('text')
    .describe('The desired format of the report (text or markdown).'),
});
export type GenerateSalesReportInput = z.infer<typeof GenerateSalesReportInputSchema>;

const GenerateSalesReportOutputSchema = z.object({
  report: z.string().describe('The generated sales report.'),
});
export type GenerateSalesReportOutput = z.infer<typeof GenerateSalesReportOutputSchema>;

export async function generateSalesReport(input: GenerateSalesReportInput): Promise<GenerateSalesReportOutput> {
  return generateSalesReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportPrompt',
  input: {schema: GenerateSalesReportInputSchema},
  output: {schema: GenerateSalesReportOutputSchema},
  prompt: `You are an AI-powered sales data analysis expert specializing in report generation.

      Based on the provided sales data, create a sales report for the specified {{timePeriod}}.

      The report type should be {{reportType}}, and the format should be {{format}}.

      Sales data: {{{salesData}}}
      `,
});

const generateSalesReportFlow = ai.defineFlow(
  {
    name: 'generateSalesReportFlow',
    inputSchema: GenerateSalesReportInputSchema,
    outputSchema: GenerateSalesReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
