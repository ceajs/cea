export type UsersConf = {
  users: Array<UserConfOpts>
}

export type UserConfOpts = {
  username: string
  password: string
  alias: string
  school: string
  addr: Array<string>
}
