import Cookies from 'js-cookie'
import { GAMEMODE_CHUNITHM, DEFAULT_LAYOUT } from './constants'

// 設定の型定義
export interface AppSettings {
  gamemode: number
  'format-example-id': string
  'layout-id': string
}

// 設定をCookieに保存
export function saveSettings(
  gamemode: number,
  selectedFormat: string,
  selectedLayout: string
): void {
  const settings: AppSettings = {
    gamemode: gamemode,
    'format-example-id': selectedFormat,
    'layout-id': selectedLayout,
  }
  Cookies.set('settings', JSON.stringify(settings), { expires: 60 })
}

// Cookieから設定を読み込み
export function loadSettings(): {
  gamemode: number
  format: string
  layout: string
} | null {
  const settingsStr = Cookies.get('settings')
  if (!settingsStr) return null

  try {
    const settings = JSON.parse(settingsStr) as AppSettings
    return {
      gamemode: settings.gamemode ?? GAMEMODE_CHUNITHM,
      format: settings['format-example-id'] || '',
      layout: settings['layout-id'] || DEFAULT_LAYOUT,
    }
  } catch (e) {
    console.error('Failed to load cookie settings:', e)
    return null
  }
}