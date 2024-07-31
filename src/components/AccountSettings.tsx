import { useOptions } from "@/hooks/useOptions"
import { handleImageChange } from "@/lib/utils"
import { updateAccountFormSchema } from "@/schemas/form"
import { supabase } from "@/services/supabase"
import { Spinner } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import picturePlaceholder from "data-base64:../../assets/images/profile-picture.svg"
import { Pencil } from "lucide-react"
import { useMemo, useState, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-toastify"
import type { z } from "zod"

import * as style from "./AccountSettings.module.css"
import Button from "./UI/Button"
import Error from "./UI/Error"
import Input from "./UI/Input"
import Label from "./UI/Label"
import SettingsBox from "./UI/SettingsBox"

interface AccountSettingsProps {
  user: string
  email: string
  currentAvatar: string
}

const AccountSettings: FC<AccountSettingsProps> = ({
  user,
  email,
  currentAvatar
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { avatar: newAvatar, setAvatar: setNewAvatar } = useOptions()

  type UpdateAccountFormSchema = z.infer<typeof updateAccountFormSchema>

  const { register, formState, handleSubmit, getValues, setValue } =
    useForm<UpdateAccountFormSchema>({
      resolver: zodResolver(updateAccountFormSchema),
      mode: "onChange"
    })

  useMemo(() => {
    if (user) {
      setValue("username", user)
    }
  }, [user])

  const handleAccountUpdate: SubmitHandler<
    UpdateAccountFormSchema
  > = async () => {
    setIsLoading(true)
    const currentAvatarName = currentAvatar.split("users_avatar/")
    let newAvatarPathName = null
    let publicUrl = null

    if (newAvatar) {
      newAvatarPathName = `${email}-${getValues("avatar")[0]?.name}`

      if (currentAvatar) {
        await supabase.storage
          .from("users_avatar")
          .remove([currentAvatarName[1]])
      }

      await supabase.storage
        .from("users_avatar")
        .upload(newAvatarPathName, getValues("avatar")[0])

      const { data } = supabase.storage
        .from("users_avatar")
        .getPublicUrl(newAvatarPathName)

      publicUrl = data.publicUrl
    }

    if (getValues("password")) {
      const { error } = await supabase.auth.updateUser({
        password: getValues("password"),
        data: {
          username: getValues("username"),
          avatar: newAvatar ? publicUrl : currentAvatar
        }
      })

      if (error) {
        toast.error(error.message)
      }

      setIsLoading(false)
    } else {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: getValues("username"),
          avatar: newAvatar ? publicUrl : currentAvatar
        }
      })

      if (error) {
        toast.error(error.message)
      }

      setIsLoading(false)
    }
  }

  return (
    <>
      <SettingsBox
        title="Account"
        description="Manage your Streaming Interactions account here.">
        <form
          className={style.form}
          onSubmit={handleSubmit(handleAccountUpdate)}>
          <div className={style.wrapper}>
            <div className={style.textInputs}>
              <div className={style.inputGroup}>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  className={style.input}
                  {...register("username")}
                />
                <ErrorMessage
                  errors={formState.errors}
                  name="username"
                  render={({ message }) => (
                    <Error className={style.error} message={message} />
                  )}
                />
              </div>
              <div className={style.inputGroup}>
                <Label htmlFor="changePassword">Change Password</Label>
                <Input
                  id="changePassword"
                  type="password"
                  className={style.input}
                  {...register("password")}
                />
                <ErrorMessage
                  errors={formState.errors}
                  name="password"
                  render={({ message }) => (
                    <Error className={style.error} message={message} />
                  )}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avatar" className={style.avatarContainer}>
                <img
                  src={
                    (newAvatar as string) || currentAvatar || picturePlaceholder
                  }
                  alt="avatar"
                  className={style.avatar}
                />
                <div className={style.editIcon}>
                  <Pencil size={24} color="var(--si-amethyst-50)" />
                </div>
                <ErrorMessage
                  errors={formState.errors}
                  name="avatar"
                  render={({ message }) => (
                    <Error className={style.avatarError} message={message} />
                  )}
                />
              </Label>
              <input
                id="avatar"
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                onInput={(e) => handleImageChange(e, setNewAvatar)}
                className={style.avatarInput}
                {...register("avatar")}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className={style.submitBtn}>
            {isLoading && <Spinner marginRight={2} size="sm" color="#f7f3ff" />}
            Update
          </Button>
        </form>
      </SettingsBox>
    </>
  )
}

export default AccountSettings
