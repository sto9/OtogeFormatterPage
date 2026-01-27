// 類似曲検索のクライアント側実装

export interface MusicData {
  meta: {
    title: string
    alias?: string[]
  }
  data: {
    [diff: string]: string // 難易度名をキー、レベルを値とする
  }
}

// 定数定義
export const GAMEMODE_CHUNITHM = 0
export const GAMEMODE_SDVX = 1

const DIFFS = [
  ['EXP', 'MAS', 'ULT'], // CHUNITHM
  ['EXH', 'MXM', 'ULT', 'INF', 'GRV', 'HVN', 'VVD', 'XCD'], // SDVX
]

const DIFFS_OR_EMPTY = [
  [...DIFFS[0], ''],
  [...DIFFS[1], ''],
]

const SYMBOL_TITLE = '\\{Title}'
const SYMBOL_LEVEL = '\\{Level}'
const SYMBOL_DIFF_UPPER = '\\{DIFF}'
const SYMBOL_DIFF_MID = '\\{Diff}'
const SYMBOL_DIFF_BEGIN = '\\{DiffBegin}'
const SYMBOL_DIFF_END = '\\{DiffEnd}'

// 正規表現パターン
const special_regex = /[ 　、。,.［］『』\[\]'"「」()（）《》【】〚〛\-～…・:!?！？+]/gu
const space_bracket_regex = /[ 　［］\[\]()（）【】]/gu
const kanji_regex = /[\p{sc=Han}]/gu

// シンボルがマッチするか確認
function isMatchSymbol(s: string, i: number, symbol: string): boolean {
  return i + symbol.length <= s.length && s.substring(i, i + symbol.length) === symbol
}

// レーベンシュタイン距離（編集距離）
function Levenshtein(s: string, t: string): number {
  const n = s.length
  const m = t.length

  const dp: number[][] = new Array(n + 1).fill(0).map(() => new Array(m + 1).fill(0))

  for (let i = 0; i < n; i++) dp[i + 1][0] = dp[i][0] + 2
  for (let j = 0; j < m; j++) dp[0][j + 1] = dp[0][j] + 1

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const D = dp[i - 1][j] + 2  // 削除コスト
      const I = dp[i][j - 1] + 1  // 挿入コスト
      let C = dp[i - 1][j - 1]
      if (s[i - 1] !== t[j - 1]) {
        C += 1  // 置換コスト
      }
      dp[i][j] = Math.min(D, I, C)
    }
  }

  return dp[n][m]
}

// 交差部分の計算
function calcIntersection(s: string, t: string): number {
  function countElements(arr: string): Map<string, number> {
    const count = new Map<string, number>()
    for (const item of arr) {
      count.set(item, (count.get(item) || 0) + 1)
    }
    return count
  }

  const s_multiset = countElements(s)
  const t_multiset = countElements(t)

  let intersection_cnt = 0
  for (const [key, value1] of s_multiset.entries()) {
    if (t_multiset.has(key)) {
      const value2 = t_multiset.get(key)!
      const minCount = Math.min(value1, value2)
      intersection_cnt += minCount
    }
  }

  return intersection_cnt
}

// 差分スコアを計算
function calcDiffScore(s: string, t: string): number {
  let score = Levenshtein(s, t)

  const s_lower = s.toLowerCase()
  const t_lower = t.toLowerCase()
  score += Levenshtein(s_lower, t_lower)

  const s_nospecial = s.replace(special_regex, '')
  const t_nospecial = t.replace(special_regex, '')
  score += Levenshtein(s_nospecial, t_nospecial)

  const s_nospecial_lower = s_nospecial.toLowerCase()
  const t_nospecial_lower = t_nospecial.toLowerCase()
  score += Levenshtein(s_nospecial_lower, t_nospecial_lower) * 4

  const s_only_kanji = s.match(kanji_regex)?.join('') || ''
  const t_only_kanji = t.match(kanji_regex)?.join('') || ''
  const isc_cnt = calcIntersection(s_only_kanji, t_only_kanji)
  score -= isc_cnt * isc_cnt * 100

  return score
}

// フォーマットに従って文章を生成
function getTargetSentence(data: MusicData, format: string, diff: string, alias: string = ''): string {
  let target_sentence = ''
  let diff_skip = false

  for (let i = 0; i < format.length; ) {
    if (format[i] === '\\') {
      if (isMatchSymbol(format, i, SYMBOL_TITLE)) {
        target_sentence += alias === '' ? data.meta.title : alias
        i += SYMBOL_TITLE.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_BEGIN)) {
        if (diff === '') {
          diff_skip = true
        }
        i += SYMBOL_DIFF_BEGIN.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_END)) {
        if (diff === '') {
          diff_skip = false
        }
        i += SYMBOL_DIFF_END.length
      } else if (isMatchSymbol(format, i, SYMBOL_LEVEL)) {
        if (diff !== '' && data.data[diff]) {
          target_sentence += data.data[diff]
        }
        i += SYMBOL_LEVEL.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_UPPER)) {
        if (!diff_skip) {
          target_sentence += diff
        }
        i += SYMBOL_DIFF_UPPER.length
      } else if (isMatchSymbol(format, i, SYMBOL_DIFF_MID)) {
        if (!diff_skip) {
          // 先頭以外小文字
          target_sentence += diff[0] + diff.slice(1).toLowerCase()
        }
        i += SYMBOL_DIFF_MID.length
      } else {
        // エラー
        throw new Error('Invalid format')
      }
    } else {
      if (!diff_skip) {
        target_sentence += format[i]
      }
      i++
    }
  }

  return target_sentence
}

// 最も可能性の高い難易度を推定
function getMostLikelyDiff(sentence: string, data: MusicData, gamemode: number): string {
  const lower_title = sentence.toLowerCase()
  const candidate_diff_and_pos: [string, number][] = []

  for (const diff of DIFFS[gamemode]) {
    const pos = lower_title.indexOf(diff.toLowerCase())
    if (pos !== -1) {
      candidate_diff_and_pos.push([diff, pos])
    }
  }

  if (candidate_diff_and_pos.length !== 0) {
    // 一番左にあるものを選ぶ
    candidate_diff_and_pos.sort((a, b) => a[1] - b[1])
    const res = candidate_diff_and_pos[0][0]
    if (data.data[res] !== undefined) {
      return res
    }
  }

  // レベルの数値を見る
  const nums = sentence.match(/[０-９0-9+＋]+/g) || []
  const normalized_nums = nums
    .map(num => num.replace('＋', '+'))
    .map(num => num.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)))

  for (const num of normalized_nums) {
    for (let di = DIFFS[gamemode].length - 1; di >= 0; di--) {
      const diff = DIFFS[gamemode][di]
      if (data.data[diff] !== undefined && data.data[diff] === num) {
        return diff
      }
    }
  }

  // 難易度が見つからない場合、最も高い難易度を選ぶ
  for (let i = DIFFS[gamemode].length - 1; i >= 0; i--) {
    if (data.data[DIFFS[gamemode][i]] !== undefined) {
      return DIFFS[gamemode][i]
    }
  }

  return ''
}

// 最も類似した曲を検索
export function getMostSimilarSentence(
  sentence: string,
  format: string,
  gamemode: number,
  musicData: MusicData[]
): { result: string; type: 'normal' | 'bold' | 'red' } {
  let min_score = 1000000
  let most_similar_data: MusicData | undefined

  for (const data of musicData) {
    for (const diff of DIFFS_OR_EMPTY[gamemode]) {
      if (diff !== '' && data.data[diff] === undefined) {
        continue
      }

      const target_sentence = getTargetSentence(data, format, diff)
      const score = calcDiffScore(sentence, target_sentence)
      if (score < min_score) {
        min_score = score
        most_similar_data = data
      }

      // エイリアスがある場合の処理
      if (data.meta.alias) {
        for (const alias of data.meta.alias) {
          const alias_sentence = getTargetSentence(data, format, diff, alias)
          const alias_score = calcDiffScore(sentence, alias_sentence)
          if (alias_score < min_score) {
            min_score = alias_score
            most_similar_data = data
          }
        }
      }
    }
  }

  if (!most_similar_data) {
    return { result: sentence, type: 'red' } // 見つからない場合は元の文字列を赤字で返す
  }

  // 難易度を推定
  const most_likely_diff = getMostLikelyDiff(sentence, most_similar_data, gamemode)
  const result = getTargetSentence(most_similar_data, format, most_likely_diff)

  // 元の文字列と一致しているか確認
  let type: 'normal' | 'bold' | 'red' = 'normal'

  if (sentence === result) {
    // 完全一致 → 矢印なし（normal）
    type = 'normal'
  } else {
    // 異なる場合は、スペース・括弧を除いて比較
    const spaceRegex = /[ 　［］\[\]()（）【】]/gu
    const sentenceNoSpace = sentence.replace(spaceRegex, '')
    const resultNoSpace = result.replace(spaceRegex, '')

    if (sentenceNoSpace === resultNoSpace) {
      // スペース・括弧のみ異なる → 黒い矢印（bold）
      type = 'bold'
    } else {
      // 文字が異なる → 赤い矢印（red）
      type = 'red'
    }
  }

  return { result, type }
}