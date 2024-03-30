import * as z from "zod"
import { PageStatus } from "@prisma/client"
import { CompleteCourse, RelatedCourseModel, CompleteBlock, RelatedBlockModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PageModel = z.object({
  id: z.string(),
  index: z.number().int(),
  status: z.nativeEnum(PageStatus),
  courseId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  cover: z.string().nullish(),
  graphPosition: jsonSchema,
})

export interface CompletePage extends z.infer<typeof PageModel> {
  course: CompleteCourse
  blocks: CompleteBlock[]
}

/**
 * RelatedPageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPageModel: z.ZodSchema<CompletePage> = z.lazy(() => PageModel.extend({
  course: RelatedCourseModel,
  blocks: RelatedBlockModel.array(),
}))
