import { supabase } from "@/services/supabase"
import { z } from "zod"

const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
const MAX_FILE_SIZE = 1024 * 1024 * 5

const fileSizeLimit = (file: FileList) => {
  if (!file[0]) return true

  return file[0]?.size <= MAX_FILE_SIZE
}

export const registerFormSchema = z
  .object({
    avatar: z
      .instanceof(FileList)
      .optional()
      .refine(fileSizeLimit, "Max image size is 5MB"),
    username: z.string().min(1, "Username required"),
    email: z.string().min(1, "E-mail required").email("E-mail invalid"),
    password: z
      .string()
      .min(1, "Password required")
      .regex(
        passRegex,
        "The password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password required")
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
