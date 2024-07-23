import { toZonedTime } from "date-fns-tz"

export const formatDate = (date: string) => {
  const HOUR_IN_MILISECONDS = 3600000

  let dateFormatted: string
  const newDate = new Date(date)
  const newUTCDate = toZonedTime(newDate, "UTC")
  const currentDate = toZonedTime(new Date(), "UTC")

  const dateDifferenceInHours =
    (currentDate.getTime() - newUTCDate.getTime()) / HOUR_IN_MILISECONDS

  const minutes = dateDifferenceInHours * 60

  if (dateDifferenceInHours < 1) {
    if (minutes < 1) {
      dateFormatted = "Just now"
    }
    if (minutes >= 1 && minutes < 2) {
      dateFormatted = "1 minute ago"
    }

    if (minutes >= 2) {
      dateFormatted = `${Math.floor(minutes)} minutes ago`
    }
  }

  if (dateDifferenceInHours >= 1 && dateDifferenceInHours < 24) {
    if (dateDifferenceInHours >= 1 && dateDifferenceInHours < 2) {
      dateFormatted = "1 hour ago"
    }

    if (dateDifferenceInHours >= 2) {
      dateFormatted = `${Math.floor(dateDifferenceInHours)} hours ago`
    }
  }

  if (dateDifferenceInHours >= 24 && dateDifferenceInHours < 48) {
    if (dateDifferenceInHours >= 48) {
      dateFormatted = `${Math.floor(dateDifferenceInHours)} days ago`
    } else {
      dateFormatted = "1 day ago"
    }
  }

  return dateFormatted
}