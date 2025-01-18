import { formatDate, ONE_MIN_IN_MS } from "@/lib/utils"
import { useEffect, useState } from "react"

const useFormattedDate = (date: string, isEdited: boolean) => {
  const [formattedDate, setFormattedDate] = useState(() =>
    formatDate(date, isEdited)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(formatDate(date, isEdited))
    }, ONE_MIN_IN_MS)

    return () => clearInterval(interval)
  }, [date, isEdited])

  return formattedDate
}

export default useFormattedDate
