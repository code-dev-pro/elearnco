import * as z from "zod"
import { CourseStatus, CourseType, CourseMode } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteFolder, RelatedFolderModel, CompleteAuthor, RelatedAuthorModel, CompletePage, RelatedPageModel, CompleteTagCourse, RelatedTagCourseModel } from "./index"

export const CourseModel = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  folderId: z.string().nullish(),
  status: z.nativeEnum(CourseStatus),
  type: z.nativeEnum(CourseType),
  mode: z.nativeEnum(CourseMode),
  updatedAt: z.date(),
  createdAt: z.date(),
  authorId: z.string(),
  image: z.string(),
})

export interface CompleteCourse extends z.infer<typeof CourseModel> {
  user: CompleteUser
  folder?: CompleteFolder | null
  author: CompleteAuthor
  pages: CompletePage[]
  tags: CompleteTagCourse[]
}

/**
 * RelatedCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCourseModel: z.ZodSchema<CompleteCourse> = z.lazy(() => CourseModel.extend({
  user: RelatedUserModel,
  folder: RelatedFolderModel.nullish(),
  author: RelatedAuthorModel,
  pages: RelatedPageModel.array(),
  tags: RelatedTagCourseModel.array(),
}))
