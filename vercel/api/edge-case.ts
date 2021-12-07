import { VercelRequest, VercelResponse } from '@vercel/node'
import edgeCases from '../data/school-edge-cases.json'

export default async function getSchoolId(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  const { name: schoolChineseName, c: isCloud } = req.query
  const { CLOUD, NOTCLOUD } = edgeCases

  if (schoolChineseName) {
    const data = isCloud ? CLOUD : NOTCLOUD
    for (const [key, value] of Object.entries(
      edgeCases[decodeURIComponent(schoolChineseName as string)] ?? {}
    )) {
      data[key] = value
    }
    return res.json(data)
  }
  return res.json({ error: 'School name not found!' })
}
