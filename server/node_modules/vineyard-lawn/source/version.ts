import {Bad_Request} from "./errors";
const pattern = /^(\d+)\.(\d+)(\.[a-z]+)?$/
const defaultPlatform = 'none'

export class Version {
  major: number
  minor: number
  platform: string

  private createFromString(text: string) {
    const match = text.match(pattern)
    if (!match)
      throw new Bad_Request('Invalid version format: ' + text)

    this.major = parseInt(match[1])
    this.minor = parseInt(match [2])
    this.platform = match[3]
      ? match[3]
      : defaultPlatform
  }

  constructor(majorOrString: number | string, minor: number = 0, platform: string = defaultPlatform) {
    if (typeof majorOrString === 'string') {
      this.createFromString(majorOrString)
    }
    else {
      this.major = majorOrString
      this.minor = minor
      this.platform = platform
    }
  }

  equals(version: Version): boolean {
    return this.major == version.major && this.minor == version.minor
  }

  toString(): string {
    return this.major + '.' + this.minor
      + (this.platform && this.platform != 'none' ? '.' + this.platform : '')
  }
}