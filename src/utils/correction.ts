import { formatterApi } from '../services/formatterApi'
import { gameModeToString } from './gameMode'
import { processInputText, restoreResultsFormat } from './uiUtils'

// 表記揺れ修正処理の結果
export interface CorrectionResult {
  success: boolean
  originalText: string
  correctedText: string
  errorMessage?: string
}

// 表記揺れ修正のメイン処理
export async function processCorrection(
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
    const { sentences, nonEmptyLines } = processInputText(inputText)
    const gameType = gameModeToString(gamemode)

    const apiResults = await formatterApi.fixSongs(gameType, selectedFormat, nonEmptyLines)
    const allResults = restoreResultsFormat(sentences, apiResults)

    return {
      success: true,
      originalText: inputText,
      correctedText: allResults.join('\n'),
    }
  } catch (error) {
    console.error('Error during correction:', error)
    return {
      success: false,
      originalText: inputText,
      correctedText: '',
      errorMessage: 'エラーが発生しました: ' + (error as Error).message,
    }
  }
}