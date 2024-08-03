import { changePasswordFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import * as style from "./PasswordChange.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"
import Loading from "./UI/Loading"

const PasswordChange = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>

  const { register, formState, handleSubmit, getValues } =
    useForm<ChangePasswordFormSchema>({
      resolver: zodResolver(changePasswordFormSchema),
      mode: "onChange"
    })

  const handlePasswordUpdate = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.updateUser({
      password: getValues("password")
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    }

    if (data) {
      toast.success("Password updated")
      setIsLoading(false)
      window.location.reload()
    }
  }

  return (
    <form
      className={style.container}
      onSubmit={handleSubmit(handlePasswordUpdate)}>
      <h3 className={style.title}>Password Reset</h3>
      <div className={style.inputGroup}>
        <Label className={style.label} htmlFor="password">
          New Password
        </Label>
        <Input
          id="password"
          type="password"
          className={style.input}
          {...register("password")}
        />
        <ErrorMessage
          errors={formState.errors}
          name="password"
          render={({ message }) => (
            <Error message={message} className={style.error} />
          )}
        />
      </div>
      <div className={style.inputGroup}>
        <Label className={style.label} htmlFor="password">
          Confirm New Password
        </Label>
        <Input
          id="password"
          type="password"
          className={style.input}
          {...register("confirmPassword")}
        />
        <ErrorMessage
          errors={formState.errors}
          name="confirmPassword"
          render={({ message }) => (
            <Error message={message} className={style.error} />
          )}
        />
      </div>
      <Button disabled={isLoading} type="submit" className={style.submitBtn}>
        {isLoading && <Loading variant="eclipse" />}
        Reset Password
      </Button>
    </form>
  )
}

export default PasswordChange
