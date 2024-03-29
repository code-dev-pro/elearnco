import { userAuthValidationSchema ,userAuthPreregisterSchema,userAuthResetSchema,userAuthDeleteAccountSchema, userAuthSigninSchema, userAuthSignupSchema, userAuthProfilSchema} from "schemas/auth/Auth";
import * as z from "zod";
export type AuthValidationFormData = z.infer<typeof userAuthValidationSchema>;
export type AuthForgetFormData = z.infer<typeof userAuthPreregisterSchema>
export type AuthDeleteAccountFormData = z.infer<typeof userAuthDeleteAccountSchema>
export type AuthResetFormData = z.infer<typeof userAuthResetSchema>
export type UserAuthSigninSchema = z.infer<typeof userAuthSigninSchema>;
export type UserAuthSignupSchema = z.infer<typeof userAuthSignupSchema>;
export type UserAuthProfilSchema = z.infer<typeof userAuthProfilSchema>;
