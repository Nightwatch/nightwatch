export interface Config {
  /**
   * Name of the API. (Pretty sure this isn't used)
   *
   * @type {string}
   * @memberof Config
   */
  readonly name: string
  /**
   * Port the API will run on.
   *
   * @type {number}
   * @memberof Config
   */
  readonly port: number
  /**
   * Name of the environment.
   *
   * @type {string}
   * @memberof Config
   */
  readonly env: 'dev' | 'prod'
  /**
   * API version. (Also probably not used anywhere)
   *
   * @type {string}
   * @memberof Config
   */
  readonly version?: string
}
