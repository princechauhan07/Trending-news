'use server';
/**
 * @fileOverview A Genkit flow that generates a concise AI-powered summary of a trending topic in Hindi.
 *
 * - generateTrendSummary - A function that handles the trend summary generation process.
 * - GenerateTrendSummaryInput - The input type for the generateTrendSummary function.
 * - GenerateTrendSummaryOutput - The return type for the generateTrendSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTrendSummaryInputSchema = z.object({
  trendDescription: z
    .string()
    .describe('The description of the trending topic to summarize.'),
});
export type GenerateTrendSummaryInput = z.infer<
  typeof GenerateTrendSummaryInputSchema
>;

const GenerateTrendSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise AI-generated summary of the trend in Hindi.'),
});
export type GenerateTrendSummaryOutput = z.infer<
  typeof GenerateTrendSummaryOutputSchema
>;

const generateTrendSummaryPrompt = ai.definePrompt({
  name: 'generateTrendSummaryPrompt',
  input: { schema: GenerateTrendSummaryInputSchema },
  output: { schema: GenerateTrendSummaryOutputSchema },
  prompt: `Summarize the following trending topic description concisely in Hindi:

Trend Description: {{{trendDescription}}}`,
});

const generateTrendSummaryFlow = ai.defineFlow(
  {
    name: 'generateTrendSummaryFlow',
    inputSchema: GenerateTrendSummaryInputSchema,
    outputSchema: GenerateTrendSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await generateTrendSummaryPrompt(input);
    return output!;
  }
);

export async function generateTrendSummary(
  input: GenerateTrendSummaryInput
): Promise<GenerateTrendSummaryOutput> {
  return generateTrendSummaryFlow(input);
}
