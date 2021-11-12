import { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'
export default async function getSchoolId(
  req: VercelRequest,
  res: VercelResponse,
): Promise<null> {
  const r = await fetch(
    'https://mobile.campushoy.com/v6/config/guest/tenant/list',
  )
  if (r.ok) {
    const data = await r.json()
    const nameIdArray = data.data.map(({ id, name }) => {
      return { id, name }
    })

    res.json(nameIdArray)
  }

  return null
}
