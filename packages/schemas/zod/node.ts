import * as z from "zod"
import { CompleteBlock, RelatedBlockModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const NodeModel = z.object({
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

export interface CompleteNode extends z.infer<typeof NodeModel> {
  block: CompleteBlock
}

/**
 * RelatedNodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNodeModel: z.ZodSchema<CompleteNode> = z.lazy(() => NodeModel.extend({
  block: RelatedBlockModel,
}))
