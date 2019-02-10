export interface AuthenticationService {
  readonly getDiscordAccessToken: (
    code: string,
    redirect: string
  ) => Promise<any>
}
