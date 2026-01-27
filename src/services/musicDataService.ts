// 楽曲データのキャッシュと管理を行うサービス

import type { MusicData } from './similaritySearch'
import { GAMEMODE_CHUNITHM, GAMEMODE_SDVX } from './similaritySearch'

export interface ApiResponse {
  songs: MusicData[]
  success: boolean
  error?: string
}

class MusicDataService {
  private apiUrl: string
  private musicDataCache: { [key: number]: MusicData[] } = {
    0: [], // CHUNITHM
    1: [], // SDVX
  }
  private loadingPromise: { [key: number]: Promise<MusicData[]> | null } = {
    0: null,
    1: null,
  }

  constructor() {
    this.apiUrl = 'https://script.google.com/macros/s/AKfycbz5u5PXUo5o2OHjgumeh0YlSACW-dPBZazyfvoMhT4u6yIivSzUApb2TT99njJZf0sf/exec'
  }

  /**
   * 楽曲データを取得（キャッシュがあればそれを返す）
   */
  async getMusicData(gamemode: number): Promise<MusicData[]> {
    // キャッシュがある場合はそれを返す
    if (this.musicDataCache[gamemode].length > 0) {
      return this.musicDataCache[gamemode]
    }

    // 既にロード中の場合は、そのPromiseを待つ
    if (this.loadingPromise[gamemode]) {
      return await this.loadingPromise[gamemode]!
    }

    // 新規ロード
    this.loadingPromise[gamemode] = this.loadMusicData(gamemode)

    try {
      const data = await this.loadingPromise[gamemode]!
      this.musicDataCache[gamemode] = data
      return data
    } finally {
      this.loadingPromise[gamemode] = null
    }
  }

  /**
   * APIから楽曲データを読み込む
   */
  private async loadMusicData(gamemode: number): Promise<MusicData[]> {
    const gameType = gamemode === GAMEMODE_CHUNITHM ? 'chunithm' : 'sdvx'

    try {
      // GETリクエストでクエリパラメータを使用（エイリアス付き）
      const url = `${this.apiUrl}?gameType=${gameType}&includeAlias=true`

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        mode: 'cors'
        // GETリクエストはシンプルリクエストなのでヘッダーは不要
      })

      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return data.songs
    } catch (error) {
      console.error('Failed to load music data:', error)
      // エラーが発生しても空の配列を返す（フォールバック）
      return []
    }
  }

  /**
   * 楽曲データをプリロード（ページ読み込み時に呼び出す）
   */
  async preloadMusicData(gamemode: number): Promise<void> {
    try {
      await this.getMusicData(gamemode)
    } catch (error) {
      console.error('Failed to preload music data:', error)
    }
  }

  /**
   * 全機種の楽曲データをプリロード（ページ読み込み時に呼び出す）
   */
  async preloadAllMusicData(): Promise<void> {
    try {
      await Promise.all([
        this.getMusicData(GAMEMODE_CHUNITHM),
        this.getMusicData(GAMEMODE_SDVX)
      ])
    } catch (error) {
      console.error('Failed to preload all music data:', error)
    }
  }

  /**
   * 全機種のデータがロード済みかどうか
   */
  isAllDataLoaded(): boolean {
    return this.musicDataCache[GAMEMODE_CHUNITHM].length > 0 &&
           this.musicDataCache[GAMEMODE_SDVX].length > 0
  }

  /**
   * キャッシュをクリア
   */
  clearCache(): void {
    this.musicDataCache[0] = []
    this.musicDataCache[1] = []
  }

  /**
   * 特定のゲームモードのキャッシュをクリア
   */
  clearCacheForGame(gamemode: number): void {
    this.musicDataCache[gamemode] = []
  }
}

// シングルトンインスタンスをエクスポート
export const musicDataService = new MusicDataService()