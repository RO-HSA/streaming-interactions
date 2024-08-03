import { z } from "zod"

const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
const MAX_FILE_SIZE = 1024 * 128

const fileSizeLimit = (file: FileList) => {
  if (!file[0]) return true

  return file[0]?.size <= MAX_FILE_SIZE
}

export const registerFormSchema = z
  .object({
    avatar: z
      .instanceof(FileList)
      .optional()
      .refine(fileSizeLimit, "Max image size is 128KB"),
    username: z
      .string()
      .trim()
      .min(1, "Username required")
      .max(16, "Username too long, max 16 characters"),
    email: z.string().min(1, "E-mail required").email("E-mail invalid"),
    password: z
      .string()
      .trim()
      .min(1, "Password required")
      .regex(
        passRegex,
        "The password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character"
      ),
    confirmPassword: z.string().trim().min(1, "Password confirmation required")
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"]
      })
    }
  })

export const loginFormSchema = z.object({
  email: z.string().min(1, "E-mail required").email("E-mail invalid"),
  password: z.string().min(1, "Please enter your password")
})

export const recoveryFormSchema = z.object({
  email: z.string().min(1, "E-mail required").email("E-mail invalid")
})

export const changePasswordFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, "Password required")
      .regex(
        passRegex,
        "The password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character"
      ),
    confirmPassword: z.string().trim().min(1, "Password confirmation required")
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"]
      })
    }
  })

export const updateAccountFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .optional()
    .refine(fileSizeLimit, "Max image size is 128KB"),
  username: z
    .string()
    .trim()
    .min(1, "Username required")
    .max(16, "Username too long, max 16 characters"),
  password: z
    .string()
    .optional()
    .refine(
      (value) => !value || passRegex.test(value),
      "The password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character"
    )
})
