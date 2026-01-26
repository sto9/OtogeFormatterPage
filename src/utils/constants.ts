// ゲームモード定数
export const GAMEMODE_CHUNITHM = 0
export const GAMEMODE_SDVX = 1

// フォーマットオプション
export interface FormatOption {
  id: string
  value: string
  label: string
}

export const DEFAULT_FORMAT_OPTIONS: FormatOption[] = [
  { id: 'format-example-choice-t', value: '\\{Title}', label: '' },
  {
    id: 'format-example-choice-lstd',
    value: '\\{DiffBegin}[\\{Level}] \\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}',
    label: '',
  },
  {
    id: 'format-example-choice-ltd',
    value: '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}\\{DiffBegin}(\\{DIFF})\\{DiffEnd}',
    label: '',
  },
  {
    id: 'format-example-choice-tdl',
    value: '\\{Title}\\{DiffBegin}[\\{DIFF}\\{Level}]\\{DiffEnd}',
    label: '',
  },
]

// デフォルト値
export const DEFAULT_FORMAT = '\\{Title}'
export const DEFAULT_LAYOUT = 'tate'
export const DEFAULT_PLACEHOLDER_TEXT = '曲名1\n曲名2\n...'

// フォーマット文字列の定数
const SYMBOL_TITLE = '\\{Title}'
const SYMBOL_LEVEL = '\\{Level}'
const SYMBOL_DIFF_UPPER = '\\{DIFF}'
const SYMBOL_DIFF_MID = '\\{Diff}'
const SYMBOL_DIFF_BEGIN = '\\{DiffBegin}'
const SYMBOL_DIFF_END = '\\{DiffEnd}'

// サンプルデータ
const SAMPLE_SONGS = [
  { title: '曲名1', diff: '難易度', level: 'レベル' },
  { title: '曲名2', diff: '難易度', level: 'レベル' }
]

function isMatchSymbol(s: string, i: number, symbol: string): boolean {
  return i + symbol.length <= s.length && s.substr(i, symbol.length) === symbol
}

// フォーマット文字列からサンプル文字列を生成
function generateSampleFromFormat(format: string, songData: { title: string; diff: string; level: string }): string {
  let result = ''
  let diffSkip = false

  for (let i = 0; i < format.length;) {
    if (format[i] === '\\') {
      if (isMatchSymbol(format, i, SYMBOL_TITLE)) {
        result += songData.title
        i += SYMBOL_TITLE.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_BEGIN)) {
        diffSkip = false // 難易度セクション開始
        i += SYMBOL_DIFF_BEGIN.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_END)) {
        diffSkip = false // 難易度セクション終了
        i += SYMBOL_DIFF_END.length
      } else if (isMatchSymbol(format, i, SYMBOL_LEVEL)) {
        if (!diffSkip) {
          result += songData.level
        }
        i += SYMBOL_LEVEL.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_UPPER)) {
        if (!diffSkip) {
          result += songData.diff
        }
        i += SYMBOL_DIFF_UPPER.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_MID)) {
        if (!diffSkip) {
          result += songData.diff[0] + songData.diff.slice(1).toLowerCase()
        }
        i += SYMBOL_DIFF_MID.length
      } else {
        // 不明なシンボル、そのまま追加
        result += format[i]
        i++
      }
    } else {
      if (!diffSkip) {
        result += format[i]
      }
      i++
    }
  }

  return result
}

// フォーマットに応じたプレースホルダーテキストを生成
export function getPlaceholderForFormat(format: string): string {
  const samples = SAMPLE_SONGS.map(song => generateSampleFromFormat(format, song))
  return samples.join('\n')
}