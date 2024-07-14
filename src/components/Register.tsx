import { registerFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@supabase/supabase-js"
import picturePlaceholder from "data-base64:../../assets/profile-picture.jpg"
import { Pencil } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./Register.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"

const Register = () => {
  const [avatar, setAvatar] = useState(null)

  type RegisterFormSchema = z.infer<typeof registerFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema),
      mode: "onChange"
    })

  const handleEmailRegister: SubmitHandler<RegisterFormSchema> = async () => {
    const avatarPathName = `${getValues("email")}-${getValues("avatar")[0].name}`
    const {
      data: {}
    } = await supabase.storage
      .from("users_avatar")
      .upload(avatarPathName, getValues("avatar")[0])

    const {
      data: { publicUrl }
    } = supabase.storage.from("users_avatar").getPublicUrl(avatarPathName)

    const { error } = await supabase.auth.signUp({
      email: getValues("email"),
      password: getValues("password"),
      options: {
        data: {
          username: getValues("username"),
          avatar: publicUrl
        }
      }
    })

    if (error) {
      toast.error(error.message)
    }
  }

  const handleImageChange = (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <form
        className={style.registerForm}
        onSubmit={handleSubmit(handleEmailRegister)}>
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
          <label htmlFor="avatar" className={style.avatarContainer}>
            <img
              src={avatar || picturePlaceholder}
              alt="avatar"
              className={style.avatar}
            />
            <div className={style.editIcon}>
              <Pencil size={12} color="var(--si-bg)" className={style.pencil} />
            </div>
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/jpeg, image/jpg, image/png, image/webp"
            onInput={handleImageChange}
            className={style.avatarInput}
            {...register("avatar")}
          />
          <ErrorMessage
            errors={formState.errors}
            name="avatar"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <label htmlFor="email">E-mail</label>
          <Input id="email" type="text" {...register("email")} />
          <ErrorMessage
            errors={formState.errors}
            name="email"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <label htmlFor="username">Username</label>
          <Input id="username" type="text" {...register("username")} />
          <ErrorMessage
            errors={formState.errors}
            name="username"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...register("password")} />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          <ErrorMessage
            errors={formState.errors}
            name="confirmPassword"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <Button type="submit" className={style.submitBtn}>
          Register
        </Button>
      </form>
    </div>
  )
}

export default Register
