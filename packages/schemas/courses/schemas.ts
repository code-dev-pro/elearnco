import * as z from "zod";
import { CourseModel, FolderModel, ImageModel, AuthorModel, BlockModel } from "../zod";
export type TCourse = z.infer<typeof CourseModel>;
export type TImage = z.infer<typeof ImageModel>;
export type TFolder = z.infer<typeof FolderModel>;
export type TAuthor = z.infer<typeof AuthorModel>;
export type TBlock = z.infer<typeof BlockModel>;
// export type TotalCourse = TCourse & { image: string } & { folder: TFolder } & {
//   author: TAuthor;
// };

export const newCourseSchema = z.object({
  title: z.string().min(3, { message: "Title must be atleast 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be atleast 10 characters" }),
});

