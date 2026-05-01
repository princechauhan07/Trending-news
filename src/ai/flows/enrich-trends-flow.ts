'use server';
/**
 * @fileOverview A Genkit flow that enriches raw search queries into bilingual Trend objects.
 * 
 * This flow takes raw search titles from India and generates professional hashtags
 * and descriptions in both Hindi and English, along with category classification.
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
  hashtag_hi: z.string().describe('Hindi hashtag, no spaces, e.g., #पश्चिमबंगालचुनाव'),
  hashtag_en: z.string().describe('English hashtag, PascalCase, no spaces, e.g., #WestBengalElections'),
  description_hi: z.string().describe('Concise description in Hindi'),
  description_en: z.string().describe('Concise description in English'),
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
  prompt: `You are an expert Indian news editor and social media strategist for "Bharat Trends".
Convert trending search queries from Google India into professional bilingual content.

For each query:
1. Create a clean Hindi hashtag (start with #, no spaces).
2. Create a clean English hashtag (start with #, PascalCase, no spaces).
3. Provide a clear 1-sentence description in both languages.
4. Categorize it accurately into: politics, economy, sports, infrastructure, finance, government, or international.

Input Queries:
{{#each rawTrends}}
- {{title}} (Approx Traffic: {{traffic}})
{{/each}}

Ensure the output is high-quality, culturally relevant, and grammatically correct in both languages.`,
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
