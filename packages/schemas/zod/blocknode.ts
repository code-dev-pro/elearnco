import * as z from "zod"
import { CompleteBlock, RelatedBlockModel, CompleteComment, RelatedCommentModel, CompleteDrawing, RelatedDrawingModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const BlockNodeModel = z.object({
  id: z.string(),
  type: z.string(),
  uuid: z.string(),
  content: jsonSchema,
  blockId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  title: z.string().nullish(),
  description: z.string().nullish(),
})

export interface CompleteBlockNode extends z.infer<typeof BlockNodeModel> {
  block: CompleteBlock
  comments: CompleteComment[]
  Drawing: CompleteDrawing[]
}

/**
 * RelatedBlockNodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBlockNodeModel: z.ZodSchema<CompleteBlockNode> = z.lazy(() => BlockNodeModel.extend({
  block: RelatedBlockModel,
  comments: RelatedCommentModel.array(),
  Drawing: RelatedDrawingModel.array(),
}))
