import { COMMENT_LANGUAGES } from "@/config/language"
import { useLang } from "@/hooks/useLang"
import { i18n } from "@/lib/utils"
import { supabase } from "@/services/supabase"
import { useState } from "react"

import * as style from "./PreferencesSettings.module.css"
import SelectInput from "./UI/SelectInput"
import SettingsBox from "./UI/SettingsBox"

const PreferencesSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { commentLang, setCommentLang } = useLang()

  const handleCommentLanguageUpdate = async (lang: string) => {
    setIsLoading(true)

    if (lang !== commentLang) {
      setCommentLang(lang)
      await supabase.auth.updateUser({
        data: {
          comment_lang: lang
        }
      })
    }

    setIsLoading(false)
  }

  return (
    <>
      <SettingsBox
        title={i18n("preferences")}
        description={i18n("preferencesSettingsDescription")}>
        <div className={style.inputs}>
          <div className={style.inputGroup}>
            <label htmlFor="commentLanguage">
              {i18n("commentsLanguageFilter")}
            </label>
            <SelectInput
              id="commentLanguage"
              disabled={isLoading}
              value={commentLang}
              onChange={(e) => handleCommentLanguageUpdate(e.target.value)}>
              {COMMENT_LANGUAGES.map((lang) => (
                <option
                  value={lang.code}
                  key={lang.code}
                  className={style.option}>
                  {lang.name}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>
      </SettingsBox>
    </>
  )
}

export default PreferencesSettings
