import { useLang } from "@/hooks/useLang"
import { usePopup } from "@/hooks/usePopup"
import { i18n } from "@/lib/utils"
import { loginFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { Spinner } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./Login.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"

const Login = () => {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })
  const [_, setUserLang] = useStorage<string>({
    key: "user_lang",
    instance: new Storage({
      area: "local"
    })
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuthType } = usePopup()
  const { setUiLang, setCommentLang } = useLang()

  type LoginFormSchema = z.infer<typeof loginFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      mode: "onSubmit"
    })

  const handleEmailLogin: SubmitHandler<LoginFormSchema> = async () => {
    setIsLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({
      email: getValues("email"),
      password: getValues("password")
    })

    if (!data.user) {
      setIsLoading(true)
    }

    if (error) {
      toast.error(error.message)
    }

    if (data.user) {
      setUser(data.user)
      setUiLang(data.user.user_metadata.ui_lang)
      setCommentLang(data.user.user_metadata.comment_lang)
      setUserLang(data.user.user_metadata.comment_lang)
      setIsLoading(false)
      setAuthType("LOGGED")
    }

    setIsLoading(false)
  }

  return (
    <div>
      <form
        className={style.loginForm}
        onSubmit={handleSubmit(handleEmailLogin)}>
        <div className={style.inputs}>
          <Label htmlFor="email">{i18n("email")}</Label>
          <Input id="email" type="text" {...register("email")} />
          <ErrorMessage
            errors={formState.errors}
            name="email"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <div className={style.inputs}>
          <Label htmlFor="password">{i18n("password")}</Label>
          <Input id="password" type="password" {...register("password")} />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <Error message={message} />}
          />
          <span
            className={style.forgot}
            onClick={() => setAuthType("RECOVERY")}>
            {i18n("forgotPassword")}
          </span>
        </div>
        <Button type="submit" disabled={isLoading} className={style.submitBtn}>
          {isLoading && <Spinner marginRight={2} size="sm" color="#f7f3ff" />}
          {i18n("loginButton")}
        </Button>
      </form>
      <div className={style.registerAnchorWrapper}>
        <p className={style.registerAnchor}>
          {i18n("noAccount")}{" "}
          <span onClick={() => setAuthType("REGISTER")}>
            {i18n("signupAnchor")}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
