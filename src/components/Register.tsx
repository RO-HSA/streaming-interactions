import { usePopup } from "@/hooks/usePopup"
import { registerFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { Spinner } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import type { AuthError } from "@supabase/supabase-js"
import picturePlaceholder from "data-base64:../../assets/profile-picture.jpg"
import { Pencil } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import * as style from "./Register.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"

const Register = () => {
  const [avatar, setAvatar] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  type RegisterFormSchema = z.infer<typeof registerFormSchema>

  const { setAuthType } = usePopup()

  const { register, formState, handleSubmit, getValues } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema),
      mode: "onChange"
    })

  const handleEmailRegister: SubmitHandler<RegisterFormSchema> = async () => {
    const avatarPathName = `${getValues("email")}-${getValues("avatar")[0].name}`

    await supabase.storage
      .from("users_avatar")
      .upload(avatarPathName, getValues("avatar")[0])

    const {
      data: { publicUrl }
    } = supabase.storage.from("users_avatar").getPublicUrl(avatarPathName)

    try {
      setIsLoading(true)
      await supabase.auth.signUp({
        email: getValues("email"),
        password: getValues("password"),
        options: {
          data: {
            username: getValues("username"),
            avatar: publicUrl
          }
        }
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
      toast.success("Account created successfully")
      setAuthType("LOGIN")
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
          <Label htmlFor="avatar" className={style.avatarContainer}>
            <img
              src={avatar || picturePlaceholder}
              alt="avatar"
              className={style.avatar}
            />
            <div className={style.editIcon}>
              <Pencil
                size={12}
                color="var(--si-amethyst-50)"
                className={style.pencil}
              />
            </div>
          </Label>
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
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="text" {...register("email")} />
          <ErrorMessage
            errors={formState.errors}
            name="email"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" {...register("username")} />
          <ErrorMessage
            errors={formState.errors}
            name="username"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <Label htmlFor="confirmPassword">Confirm password</Label>
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
          {isLoading && <Spinner color="#fcfcfc" />}
          Register
        </Button>
      </form>
      <div className={style.loginAnchorWrapper}>
        <p className={style.loginAnchor}>
          Already have an account?{" "}
          <span onClick={() => setAuthType("LOGIN")}>log in</span>
        </p>
      </div>
    </div>
  )
}

export default Register
