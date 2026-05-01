'use server';
/**
 * @fileOverview A Genkit flow that enriches raw trend titles into full bilingual Trend objects.
 *
 * - enrichTrends - Processes a list of raw trend queries into the Bharat Trends structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EnrichTrendsInputSchema = z.object({
  rawTrends: z.array(z.object({
    title: z.string(),
    traffic: z.string(),
  })),
});
export type EnrichTrendsInput = z.infer<typeof EnrichTrendsInputSchema>;

const TrendItemSchema = z.object({
  hashtag_hi: z.string(),
  hashtag_en: z.string(),
  description_hi: z.string(),
  description_en: z.string(),
  category: z.string().describe('Must be one of: politics, economy, sports, infrastructure, finance, government, international'),
});

const EnrichTrendsOutputSchema = z.object({
  enriched: z.array(TrendItemSchema),
});
export type EnrichTrendsOutput = z.infer<typeof EnrichTrendsOutputSchema>;

const enrichTrendsPrompt = ai.definePrompt({
  name: 'enrichTrendsPrompt',
  input: { schema: EnrichTrendsInputSchema },
  output: { schema: EnrichTrendsOutputSchema },
  prompt: `You are a specialized news editor for Bharat Trends.
Convert the following trending search queries from India into a bilingual (English and Hindi) structured format.

For each query:
1. Create a clean English hashtag (no spaces, PascalCase).
2. Create a clean Hindi hashtag (no spaces).
3. Provide a concise description in both English and Hindi.
4. Categorize it accurately into one of the allowed categories.

Input Queries:
{{#each rawTrends}}
- {{title}} (Traffic: {{traffic}})
{{/each}}

Ensure the category is exactly one of: politics, economy, sports, infrastructure, finance, government, international.`,
});

const enrichTrendsFlow = ai.defineFlow(
  {
    name: 'enrichTrendsFlow',
    inputSchema: EnrichTrendsInputSchema,
    outputSchema: EnrichTrendsOutputSchema,
  },
  async (input) => {
    const { output } = await enrichTrendsPrompt(input);
    return output!;
  }
);

export async function enrichTrends(
  input: EnrichTrendsInput
): Promise<EnrichTrendsOutput> {
  return enrichTrendsFlow(input);
}
