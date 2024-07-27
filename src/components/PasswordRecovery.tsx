import { usePopup } from "@/hooks/usePopup"
import { recoveryFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { Spinner } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import * as style from "./Login.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"

const PasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setAuthType } = usePopup()

  type RecoveryFormSchema = z.infer<typeof recoveryFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<RecoveryFormSchema>({
      resolver: zodResolver(recoveryFormSchema),
      mode: "onSubmit"
    })

  const handleRecovery: SubmitHandler<RecoveryFormSchema> = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(
      getValues("email")
    )

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    }

    toast.info(
      "If the email exists, you will receive an email to recover your account"
    )

    setIsLoading(false)
    setAuthType("LOGIN")
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
        <Button type="submit" disabled={isLoading} className={style.submitBtn}>
          {isLoading && <Spinner marginRight={2} size="xs" color="#f7f3ff" />}
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
