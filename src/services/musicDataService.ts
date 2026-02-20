// 楽曲データのキャッシュと管理を行うサービス

import type { MusicData } from './similaritySearch'
import { GAMEMODE_CHUNITHM, GAMEMODE_SDVX, GAMEMODE_MAIMAI, GAMEMODE_ONGEKI } from './similaritySearch'

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
    2: [], // maimai
    3: [], // オンゲキ
  }
  private loadingPromise: { [key: number]: Promise<MusicData[]> | null } = {
    0: null,
    1: null,
    2: null,
    3: null,
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
   * maimai APIレスポンスのdataキーを正規化（REMAS → ReMAS）
   */
  private normalizeMaimaiKeys(data: { [key: string]: string }): { [key: string]: string } {
    const normalized: { [key: string]: string } = {}
    for (const [key, value] of Object.entries(data)) {
      normalized[key === 'REMAS' ? 'ReMAS' : key] = value
    }
    return normalized
  }

  /**
   * maimai APIレスポンスをフラット構造に変換
   * API形式: { meta: { title }, data: { std: {...}, dx: {...} } }
   * → MusicData[]: { meta: { title, chartType, hasBothTypes }, data: { BAS:..., MAS:... } }
   */
  private transformMaimaiData(songs: any[]): MusicData[] {
    const result: MusicData[] = []

    for (const song of songs) {
      const title = song.meta?.title || ''
      const alias = song.meta?.alias
      const stdData = song.data?.std
      const dxData = song.data?.dx
      const hasBothTypes = !!(stdData && dxData && Object.keys(stdData).length > 0 && Object.keys(dxData).length > 0)

      if (stdData && Object.keys(stdData).length > 0) {
        result.push({
          meta: { title, ...(alias ? { alias } : {}), chartType: 'STD', hasBothTypes },
          data: this.normalizeMaimaiKeys(stdData),
        })
      }

      if (dxData && Object.keys(dxData).length > 0) {
        result.push({
          meta: { title, ...(alias ? { alias } : {}), chartType: 'DX', hasBothTypes },
          data: this.normalizeMaimaiKeys(dxData),
        })
      }

      // STDもDXもない場合（フォールバック）
      if ((!stdData || Object.keys(stdData).length === 0) && (!dxData || Object.keys(dxData).length === 0)) {
        result.push({
          meta: { title, ...(alias ? { alias } : {}), hasBothTypes: false },
          data: song.data ? this.normalizeMaimaiKeys(song.data) : {},
        })
      }
    }

    return result
  }

  /**
   * APIから楽曲データを読み込む
   */
  private async loadMusicData(gamemode: number): Promise<MusicData[]> {
    const gameTypeMap: { [key: number]: string } = {
      [GAMEMODE_CHUNITHM]: 'chunithm',
      [GAMEMODE_SDVX]: 'sdvx',
      [GAMEMODE_MAIMAI]: 'maimai',
      [GAMEMODE_ONGEKI]: 'ongeki',
    }
    const gameType = gameTypeMap[gamemode] || 'chunithm'

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

      // maimaiの場合はstd/dx構造をフラットに変換
      if (gamemode === GAMEMODE_MAIMAI) {
        return this.transformMaimaiData(data.songs)
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
        this.getMusicData(GAMEMODE_SDVX),
        this.getMusicData(GAMEMODE_MAIMAI),
        this.getMusicData(GAMEMODE_ONGEKI),
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
           this.musicDataCache[GAMEMODE_SDVX].length > 0 &&
           this.musicDataCache[GAMEMODE_MAIMAI].length > 0 &&
           this.musicDataCache[GAMEMODE_ONGEKI].length > 0
  }

  /**
   * キャッシュをクリア
   */
  clearCache(): void {
    this.musicDataCache[0] = []
    this.musicDataCache[1] = []
    this.musicDataCache[2] = []
    this.musicDataCache[3] = []
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