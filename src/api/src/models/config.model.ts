export interface Config {
  /**
   * Name of the API. (Pretty sure this isn't used)
   */
  readonly name: string
  /**
   * Port the API will run on.
   */
  readonly port: number
  /**
   * Name of the environment.
   */
  readonly env: 'dev' | 'prod'
  /**
   * API version. (Also probably not used anywhere)
   */
  readonly version?: string
}
