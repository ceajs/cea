import { CheckIn } from '@ceajs/check-in-helper'
import { handleCookie, sstore } from '@ceajs/core'
export async function checkIn() {
  // Get cookie
  await handleCookie()
  // Grab users
  const users = sstore.get('users')
  if (users?.length) {
    // Sign in
    const logs = await CheckIn.signIn(users, 'attendance')
    // Log out results
    if (logs) {
      console.table(logs)
    }
  }
}
