// OtogeFormatter API Client Service for Vue

export interface ApiResponse {
  results: string[]
  types?: string[]
  success: boolean
  error?: string
}

export interface ApiStatus {
  message: string
  usage: string
  version: string
}

class FormatterAPIService {
  private apiUrl: string

  constructor() {
    // 開発環境ではプロキシを使用、本番環境では直接URLを使用
    this.apiUrl = import.meta.env.DEV
      ? '/api'
      : 'https://script.google.com/macros/s/AKfycbz5u5PXUo5o2OHjgumeh0YlSACW-dPBZazyfvoMhT4u6yIivSzUApb2TT99njJZf0sf/exec'
  }

  /**
   * APIステータスをチェック
   */
  async checkStatus(): Promise<ApiStatus | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        redirect: 'follow'
      })
      return await response.json()
    } catch (error) {
      console.error('API status check failed:', error)
      return null
    }
  }

  /**
   * 表記揺れを修正
   */
  async fixSongs(
    gameType: 'chunithm' | 'sdvx',
    format: string,
    songs: string[]
  ): Promise<{ results: string[]; types: string[] }> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameType,
          format,
          songs
        })
      })

      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return {
        results: data.results,
        types: data.types || []
      }
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
}

// シングルトンインスタンスをエクスポート
export const formatterApi = new FormatterAPIService()