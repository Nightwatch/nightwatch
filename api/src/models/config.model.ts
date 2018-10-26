export interface Config {
  /**
   * Name of the API. (Pretty sure this isn't used)
   *
   * @type {string}
   * @memberof Config
   */
  name: string
  /**
   * Port the API will run on.
   *
   * @type {number}
   * @memberof Config
   */
  port: number
  /**
   * Name of the environment.
   *
   * @type {string}
   * @memberof Config
   */
  env: 'dev' | 'prod'
  /**
   * API version. (Also probably not used anywhere)
   *
   * @type {string}
   * @memberof Config
   */
  version?: string
}
