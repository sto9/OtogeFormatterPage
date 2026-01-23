import { GAMEMODE_CHUNITHM, GAMEMODE_SDVX, type FormatOption } from './constants'

// ゲームタイプを文字列に変換
export function gameModeToString(gamemode: number): 'chunithm' | 'sdvx' {
  return gamemode === GAMEMODE_CHUNITHM ? 'chunithm' : 'sdvx'
}

// フォーマットオプションのラベルを更新
export function updateFormatLabels(formatOptions: FormatOption[], gamemode: number): void {
  formatOptions.forEach((option) => {
    if (gamemode === GAMEMODE_CHUNITHM) {
      switch (option.value) {
        case '\\{Title}':
          option.label = '光線チューニング'
          break
        case '\\{DiffBegin}[\\{Level}] \\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[12] 光線チューニング(MAS)'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[12]光線チューニング(MAS)'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}':
          option.label = '[12]光線チューニング'
          break
        case '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}':
          option.label = '光線チューニング[MAS12]'
          break
        default:
          option.label = option.value
      }
    } else if (gamemode === GAMEMODE_SDVX) {
      switch (option.value) {
        case '\\{Title}':
          option.label = '大宇宙ステージ'
          break
        case '\\{DiffBegin}[\\{Level}] \\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[17] 大宇宙ステージ(EXH)'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[17]大宇宙ステージ(EXH)'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}':
          option.label = '[17]大宇宙ステージ'
          break
        case '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}':
          option.label = '大宇宙ステージ[EXH17]'
          break
        default:
          option.label = option.value
      }
    }
  })
}