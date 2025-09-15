'use server';
/**
 * @fileOverview A flow to autofill the pre-order form with Telegram user data.
 *
 * - autofillPreorderForm - A function that handles the autofilling process.
 * - AutofillPreorderFormInput - The input type for the autofillPreorderForm function.
 * - AutofillPreorderFormOutput - The return type for the autofillPreorderForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutofillPreorderFormInputSchema = z.object({
  initDataUnsafe: z
    .string()
    .describe('The initDataUnsafe from the Telegram WebApp API.'),
});
export type AutofillPreorderFormInput = z.infer<typeof AutofillPreorderFormInputSchema>;

const AutofillPreorderFormOutputSchema = z.object({
  firstName: z.string().describe('The first name of the user.'),
  lastName: z.string().describe('The last name of the user.'),
  username: z.string().describe('The Telegram username of the user.'),
});
export type AutofillPreorderFormOutput = z.infer<typeof AutofillPreorderFormOutputSchema>;

export async function autofillPreorderForm(
  input: AutofillPreorderFormInput
): Promise<AutofillPreorderFormOutput> {
  return autofillPreorderFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autofillPreorderFormPrompt',
  input: {schema: AutofillPreorderFormInputSchema},
  output: {schema: AutofillPreorderFormOutputSchema},
  prompt: `You are a helpful assistant that extracts user information from Telegram WebApp API's initDataUnsafe string.

  Given the following initDataUnsafe string, extract the user's first name, last name, and username.

  initDataUnsafe: {{{initDataUnsafe}}}

  Return the information in a JSON format.
  `,
});

const autofillPreorderFormFlow = ai.defineFlow(
  {
    name: 'autofillPreorderFormFlow',
    inputSchema: AutofillPreorderFormInputSchema,
    outputSchema: AutofillPreorderFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
