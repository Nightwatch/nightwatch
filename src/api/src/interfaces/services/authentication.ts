export interface AuthenticationService {
  getDiscordAccessToken: (code: string, redirect: string) => Promise<any>
}
