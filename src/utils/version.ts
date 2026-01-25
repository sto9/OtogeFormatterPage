import yaml from 'js-yaml'

interface VersionInfo {
  version: string
  name: string
  description: string
  build_date: string
  author: string
}

export async function getVersionInfo(): Promise<VersionInfo> {
  try {
    const response = await fetch('/version.yaml')
    const yamlText = await response.text()
    const versionInfo = yaml.load(yamlText) as VersionInfo
    return versionInfo
  } catch (error) {
    console.error('Failed to load version info:', error)
    // フォールバック値
    return {
      version: '-',
      name: '音ゲー曲の表記揺れ直すやつ',
      description: '-',
      build_date: '-',
      author: '-',
    }
  }
}
