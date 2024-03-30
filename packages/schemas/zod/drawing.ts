import * as z from "zod"
import { CompleteBlockNode, RelatedBlockNodeModel, CompleteUser, RelatedUserModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const DrawingModel = z.object({
  id: z.string(),
  content: jsonSchema,
  updatedAt: z.date(),
  createdAt: z.date(),
  BlockNodeId: z.string(),
  userId: z.string(),
})

export interface CompleteDrawing extends z.infer<typeof DrawingModel> {
  blockNode: CompleteBlockNode
  user: CompleteUser
}

/**
 * RelatedDrawingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDrawingModel: z.ZodSchema<CompleteDrawing> = z.lazy(() => DrawingModel.extend({
  blockNode: RelatedBlockNodeModel,
  user: RelatedUserModel,
}))
