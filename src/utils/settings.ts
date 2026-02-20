import Cookies from 'js-cookie'
import { GAMEMODE_CHUNITHM, DEFAULT_LAYOUT } from './constants'

import type { ChartTypeMode } from '../services/similaritySearch'

// 設定の型定義
export interface AppSettings {
  gamemode: number
  'format-example-id': string
  'layout-id': string
  maimaiChartTypeMode?: ChartTypeMode
}

// 設定をCookieに保存
export function saveSettings(
  gamemode: number,
  selectedFormat: string,
  selectedLayout: string,
  maimaiChartTypeMode?: ChartTypeMode
): void {
  const settings: AppSettings = {
    gamemode: gamemode,
    'format-example-id': selectedFormat,
    'layout-id': selectedLayout,
    maimaiChartTypeMode: maimaiChartTypeMode,
  }
  Cookies.set('settings', JSON.stringify(settings), { expires: 60 })
}

// Cookieから設定を読み込み
export function loadSettings(): {
  gamemode: number
  format: string
  layout: string
  maimaiChartTypeMode: ChartTypeMode
} | null {
  const settingsStr = Cookies.get('settings')
  if (!settingsStr) return null

  try {
    const settings = JSON.parse(settingsStr) as AppSettings
    return {
      gamemode: settings.gamemode ?? GAMEMODE_CHUNITHM,
      format: settings['format-example-id'] || '',
      layout: settings['layout-id'] || DEFAULT_LAYOUT,
      maimaiChartTypeMode: settings.maimaiChartTypeMode || 'both-only',
    }
  } catch (e) {
    console.error('Failed to load cookie settings:', e)
    return null
  }
}