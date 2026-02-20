import { GAMEMODE_CHUNITHM, GAMEMODE_SDVX, GAMEMODE_MAIMAI, GAMEMODE_ONGEKI, type FormatOption } from './constants'

// ゲームタイプを文字列に変換
export function gameModeToString(gamemode: number): 'chunithm' | 'sdvx' | 'maimai' | 'ongeki' {
  switch (gamemode) {
    case GAMEMODE_CHUNITHM:
      return 'chunithm'
    case GAMEMODE_SDVX:
      return 'sdvx'
    case GAMEMODE_MAIMAI:
      return 'maimai'
    case GAMEMODE_ONGEKI:
      return 'ongeki'
    default:
      return 'chunithm'
  }
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
        case '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}':
          option.label = '大宇宙ステージ[EXH17]'
          break
        default:
          option.label = option.value
      }
    } else if (gamemode === GAMEMODE_MAIMAI) {
      switch (option.value) {
        case '\\{Title}':
          option.label = 'ジングルベル'
          break
        case '\\{DiffBegin}[\\{Level}] \\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[14+] ジングルベル(MAS)<DX>'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[14+]ジングルベル(MAS)<DX>'
          break
        case '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}':
          option.label = 'ジングルベル[MAS14+]<DX>'
          break
        default:
          option.label = option.value
      }
    } else if (gamemode === GAMEMODE_ONGEKI) {
      switch (option.value) {
        case '\\{Title}':
          option.label = 'STARTLINER'
          break
        case '\\{DiffBegin}[\\{Level}] \\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[12+] STARTLINER(LUN)'
          break
        case '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}':
          option.label = '[12+]STARTLINER(LUN)'
          break
        case '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}':
          option.label = 'STARTLINER[LUN12+]'
          break
        default:
          option.label = option.value
      }
    }
  })
}
