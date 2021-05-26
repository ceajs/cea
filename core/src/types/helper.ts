export type StringKV = {
  [key: string]: string
}

export enum CampusphereEndpoint {
  getStuSignInfosInOneDay =
    '/wec-counselor-sign-apps/stu/sign/getStuSignInfosInOneDay',
  detailSignInstance = '/wec-counselor-sign-apps/stu/sign/detailSignInstance',
  submitSign = '/wec-counselor-sign-apps/stu/sign/submitSign',
}
