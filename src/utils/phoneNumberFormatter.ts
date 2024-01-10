export function formatPhoneNumber(phoneNumber: string): string | null {
  const numericPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')

  if (numericPhoneNumber.length === 9) {
    return numericPhoneNumber
  } else {
    if (numericPhoneNumber.length > 9) {
      return numericPhoneNumber.slice(-9)
    }
    return null
  }
}
