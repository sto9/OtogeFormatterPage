// クライアント側で表記揺れ修正処理を行う

import { getMostSimilarSentence } from '../services/similaritySearch'
import { musicDataService } from '../services/musicDataService'
import { gameModeToString } from './gameMode'
import { processInputText, restoreResultsFormat } from './uiUtils'

// 表記揺れ修正処理の結果
export interface CorrectionResult {
  success: boolean
  originalText: string
  correctedText: string
  types?: string[]
  errorMessage?: string
}

// クライアント側での表記揺れ修正のメイン処理
export async function processClientCorrection(
  inputText: string,
  gamemode: number,
  selectedFormat: string
): Promise<CorrectionResult> {
  if (!inputText.trim()) {
    return {
      success: true,
      originalText: '',
      correctedText: '',
    }
  }

  try {
    // 楽曲データを取得
    const musicData = await musicDataService.getMusicData(gamemode)

    if (musicData.length === 0) {
      throw new Error('楽曲データの取得に失敗しました')
    }

    const { sentences, nonEmptyLines } = processInputText(inputText)

    // 各行に対して類似度検索を実行
    const results: string[] = []
    const types: string[] = []

    for (const line of nonEmptyLines) {
      if (line === '') {
        results.push('')
        types.push('normal')
      } else {
        const { result, type } = getMostSimilarSentence(line, selectedFormat, gamemode, musicData)
        results.push(result)
        types.push(type)
      }
    }

    // 元のフォーマットに戻す
    const { results: allResults, types: allTypes } = restoreResultsFormat(sentences, {
      results,
      types
    })

    return {
      success: true,
      originalText: inputText,
      correctedText: allResults.join('\n'),
      types: allTypes,
    }
  } catch (error) {
    console.error('Error during client correction:', error)
    return {
      success: false,
      originalText: inputText,
      correctedText: '',
      errorMessage: 'エラーが発生しました: ' + (error as Error).message,
    }
  }
}

// 楽曲データをプリロード
export async function preloadMusicData(gamemode: number): Promise<void> {
  await musicDataService.preloadMusicData(gamemode)
}

// 全機種の楽曲データをプリロード
export async function preloadAllMusicData(): Promise<void> {
  await musicDataService.preloadAllMusicData()
}

// 全機種のデータがロード済みかどうか
export function isAllMusicDataLoaded(): boolean {
  return musicDataService.isAllDataLoaded()
}