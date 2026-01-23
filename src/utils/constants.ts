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
    id: 'format-example-choice-lt',
    value: '\\{DiffBegin}[\\{Level}]\\{DiffEnd}\\{Title}',
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