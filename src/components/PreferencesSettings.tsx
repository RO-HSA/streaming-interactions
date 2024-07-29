import { COMMENT_LANGUAGES, UI_LANGUAGES } from "@/config/language"
import { useLang } from "@/hooks/useLang"
import { supabase } from "@/services/supabase"
import { useState } from "react"

import * as style from "./PreferencesSettings.module.css"
import SelectInput from "./UI/SelectInput"
import SettingsBox from "./UI/SettingsBox"

const PreferencesSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { uiLang, commentLang, setUiLang, setCommentLang } = useLang()

  const handleUiLanguageUpdate = async (lang: string) => {
    setIsLoading(true)

    if (lang !== uiLang) {
      setUiLang(lang)

      await supabase.auth.updateUser({
        data: {
          ui_lang: lang
        }
      })
    }

    setIsLoading(false)
  }

  const handleCommentLanguageUpdate = async (lang: string) => {
    setIsLoading(true)

    if (lang !== commentLang) {
      setCommentLang(lang)
      await supabase.auth.updateUser({
        data: {
          commment_lang: lang
        }
      })
    }

    setIsLoading(false)
  }

  return (
    <>
      <SettingsBox
        id="#preferences"
        title="Preferences"
        description="Changes your preferences to whatever you wish.">
        <div className={style.inputs}>
          <div className={style.inputGroup}>
            <label htmlFor="interfaceLanguage">Interface Language</label>
            <SelectInput
              id="interfaceLanguage"
              disabled={isLoading}
              onChange={(e) => handleUiLanguageUpdate(e.target.value)}>
              {UI_LANGUAGES.map((lang) => (
                <option
                  value={lang.code}
                  key={lang.code}
                  selected={lang.code === uiLang}>
                  {lang.name}
                </option>
              ))}
            </SelectInput>
          </div>
          <div className={style.inputGroup}>
            <label htmlFor="commentLanguage">Comments Language Filter</label>
            <SelectInput
              id="commentLanguage"
              disabled={isLoading}
              onChange={(e) => handleCommentLanguageUpdate(e.target.value)}>
              {COMMENT_LANGUAGES.map((lang) => (
                <option
                  value={lang.code}
                  key={lang.code}
                  selected={lang.code === commentLang}>
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
