import * as z from "zod"
import { CompleteCourse, RelatedCourseModel } from "./index"

export const TagCourseModel = z.object({
  id: z.string(),
  courseId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  label: z.string(),
  color: z.string(),
  uuid: z.string(),
})

export interface CompleteTagCourse extends z.infer<typeof TagCourseModel> {
  course: CompleteCourse
}

/**
 * RelatedTagCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagCourseModel: z.ZodSchema<CompleteTagCourse> = z.lazy(() => TagCourseModel.extend({
  course: RelatedCourseModel,
}))
