import { usePopup } from "@/hooks/usePopup"
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuthType } = usePopup()

  type LoginFormSchema = z.infer<typeof loginFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      mode: "onSubmit"
    })

  const handleEmailLogin: SubmitHandler<LoginFormSchema> = async () => {
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

    setIsLoading(false)

    if (data.user) {
      setAuthType("LOGGED")
    }
  }

  return (
    <div>
      <form
        className={style.loginForm}
        onSubmit={handleSubmit(handleEmailLogin)}>
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
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          <ErrorMessage
            errors={formState.errors}
            name="password"
            render={({ message }) => <Error message={message} />}
          />
          <span
            className={style.forgot}
            onClick={() => setAuthType("RECOVERY")}>
            forgot your password?
          </span>
        </div>
        <Button type="submit" className={style.submitBtn}>
          {isLoading && <Spinner marginRight={2} size="xs" color="#fcfcfc" />}
          Login
        </Button>
      </form>
      <div className={style.registerAnchorWrapper}>
        <p className={style.registerAnchor}>
          Don't have an account?{" "}
          <span onClick={() => setAuthType("REGISTER")}>sign up</span>
        </p>
      </div>
    </div>
  )
}

export default Login
