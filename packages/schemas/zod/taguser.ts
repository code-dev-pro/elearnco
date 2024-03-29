import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const TagUserModel = z.object({
  id: z.string(),
  userId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  label: z.string(),
  color: z.string(),
  uuid: z.string(),
})

export interface CompleteTagUser extends z.infer<typeof TagUserModel> {
  user: CompleteUser
}

/**
 * RelatedTagUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagUserModel: z.ZodSchema<CompleteTagUser> = z.lazy(() => TagUserModel.extend({
  user: RelatedUserModel,
}))
