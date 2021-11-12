import { VercelRequest, VercelResponse } from '@vercel/node'
import * as edgeCases from '../data/school-edge-cases.json'

export default async function getSchoolId(
  req: VercelRequest,
  res: VercelResponse,
): Promise<null> {
  const { name: schoolChineseName, c: isCloud } = req.query
  const { CLOUD, NOTCLOUD } = edgeCases
  if (schoolChineseName) {
    const data = isCloud ? CLOUD : NOTCLOUD
    for (
      const [key, value] of Object.entries(
        edgeCases[schoolChineseName as string] ?? {},
      )
    ) {
      data[key] = value
    }
    res.json(data)
  }
  return null
}
