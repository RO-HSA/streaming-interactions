import { useOptions } from "@/hooks/useOptions"
import { usePopup } from "@/hooks/usePopup"
import { handleImageChange } from "@/lib/utils"
import { registerFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { Spinner } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import picturePlaceholder from "data-base64:../../assets/images/profile-picture.svg"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import * as style from "./Register.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  type RegisterFormSchema = z.infer<typeof registerFormSchema>

  const { avatar, setAvatar } = useOptions()
  const { setAuthType } = usePopup()

  const { register, formState, handleSubmit, getValues } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(registerFormSchema),
      mode: "onChange"
    })

  const handleEmailRegister: SubmitHandler<RegisterFormSchema> = async () => {
    setIsLoading(true)
    const avatarPathName = `${getValues("email")}-${getValues("avatar")[0].name}`

    await supabase.storage
      .from("users_avatar")
      .upload(avatarPathName, getValues("avatar")[0])

    const {
      data: { publicUrl }
    } = supabase.storage.from("users_avatar").getPublicUrl(avatarPathName)

    const userLang = chrome.i18n.getUILanguage()

    const { error, data } = await supabase.auth.signUp({
      email: getValues("email"),
      password: getValues("password"),
      options: {
        data: {
          username: getValues("username"),
          avatar: publicUrl,
          ui_lang: "en",
          comment_lang: userLang
        }
      }
    })

    if (error) {
      toast.error(error.message)
    }

    if (data.user.identities.length === 0) {
      toast.error("Email already in use")
    }

    if (data.user.identities.length > 0) {
      toast.success("Account created successfully, please confirm your e-mail")
      setAuthType("LOGIN")
    }

    setIsLoading(false)
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
              src={(avatar as string) || picturePlaceholder}
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
            onInput={(e) => handleImageChange(e, setAvatar)}
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
        <Button type="submit" disabled={isLoading} className={style.submitBtn}>
          {isLoading && <Spinner marginRight={2} size="sm" color="#f7f3ff" />}
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
