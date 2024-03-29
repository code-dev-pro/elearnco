import * as z from "zod"
import { CompleteBlockNode, RelatedBlockNodeModel, CompleteUser, RelatedUserModel } from "./index"

export const CommentModel = z.object({
  id: z.string(),
  content: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  BlockNodeId: z.string(),
  userId: z.string(),
})

export interface CompleteComment extends z.infer<typeof CommentModel> {
  blockNode: CompleteBlockNode
  user: CompleteUser
}

/**
 * RelatedCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommentModel: z.ZodSchema<CompleteComment> = z.lazy(() => CommentModel.extend({
  blockNode: RelatedBlockNodeModel,
  user: RelatedUserModel,
}))
