import { z } from 'zod'

export const SendMessageValidator = z.object({
  journalEntryId: z.string(),
  message: z.string(),
})
