// 矢印表示のHTMLを生成
export function generateArrowsHtml(sentences: string[], results: string[]): string {
  let content = ''
  const spaceRegex = /[ 　［］\[\]()（）【】]/gu

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i] !== results[i]) {
      const sentenceNoSpace = sentences[i].replace(spaceRegex, '')
      const resultNoSpace = results[i].replace(spaceRegex, '')
      if (sentenceNoSpace === resultNoSpace) {
        content += '►'
      } else {
        content += '<span style="color: red;">►</span>'
      }
    }
    content += '<br>'
  }

  if (sentences.length <= 4) {
    for (let i = sentences.length; i < 4; i++) {
      content += '<br>'
    }
  }

  return content
}

// 結果をクリア
export function getEmptyResultsHtml(): string {
  return '<br><br><br><br>'
}

// 入力文字列を処理用に分割
export function processInputText(inputText: string): {
  sentences: string[]
  nonEmptyLines: string[]
} {
  const sentences = inputText.split('\n')
  const nonEmptyLines = sentences.filter(s => s.trim() !== '')
  return { sentences, nonEmptyLines }
}

// API結果を元の形式に復元
export function restoreResultsFormat(
  originalSentences: string[],
  apiResults: string[]
): string[] {
  const allResults: string[] = []
  let resultIndex = 0

  for (const sentence of originalSentences) {
    if (sentence.trim() !== '') {
      allResults.push(apiResults[resultIndex] || '')
      resultIndex++
    } else {
      allResults.push('')
    }
  }

  return allResults
}