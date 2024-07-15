import { usePopup } from "@/hooks/usePopup"
import { recoveryFormSchema } from "@/schemas/form"
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

const PasswordRecovery = () => {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuthType } = usePopup()

  type RecoveryFormSchema = z.infer<typeof recoveryFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<RecoveryFormSchema>({
      resolver: zodResolver(recoveryFormSchema),
      mode: "onSubmit"
    })

  const handleRecovery: SubmitHandler<RecoveryFormSchema> = async () => {
    // const { data } = await supabase.from("authors").select("*")
    // console.log(data)
    const { error, data } = await supabase.auth.resetPasswordForEmail(
      getValues("email")
    )

    console.log(error)

    // if (!data.user) {
    //   setIsLoading(true)
    // }

    // if (error) {
    //   toast.error(error.message)
    // }

    // setIsLoading(false)

    // if (data.user) {
    //   setAuthType("LOGGED")
    // }
  }

  return (
    <div>
      <form className={style.loginForm} onSubmit={handleSubmit(handleRecovery)}>
        <div className={style.inputs}>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="text" {...register("email")} />
          <ErrorMessage
            errors={formState.errors}
            name="email"
            render={({ message }) => <Error message={message} />}
          />
        </div>
        <Button type="submit" className={style.submitBtn}>
          {isLoading && <Spinner marginRight={2} size="xs" color="#fcfcfc" />}
          Recover account
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

export default PasswordRecovery
