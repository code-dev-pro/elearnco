import * as z from "zod"
import { CompleteBlock, RelatedBlockModel } from "./index"

export const TagBlockModel = z.object({
  id: z.string(),
  blockId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  content: z.string(),
})

export interface CompleteTagBlock extends z.infer<typeof TagBlockModel> {
  block: CompleteBlock
}

/**
 * RelatedTagBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagBlockModel: z.ZodSchema<CompleteTagBlock> = z.lazy(() => TagBlockModel.extend({
  block: RelatedBlockModel,
}))
