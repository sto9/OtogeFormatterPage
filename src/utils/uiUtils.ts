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
  apiData: { results: string[]; types?: string[] }
): { results: string[]; types: string[] } {
  const allResults: string[] = []
  const allTypes: string[] = []
  let resultIndex = 0

  // typesが存在しない場合、結果を比較して自動判定
  const generateTypes = !apiData.types
  const spaceRegex = /[ 　［］\[\]()（）【】]/gu

  for (let i = 0; i < originalSentences.length; i++) {
    const sentence = originalSentences[i]
    if (sentence.trim() !== '') {
      const result = apiData.results[resultIndex] || ''
      allResults.push(result)

      if (generateTypes) {
        // typesがない場合は結果を比較して判定
        if (!result) {
          allTypes.push('red')
        } else if (sentence === result) {
          allTypes.push('normal')
        } else {
          const sentenceNoSpace = sentence.replace(spaceRegex, '')
          const resultNoSpace = result.replace(spaceRegex, '')
          if (sentenceNoSpace === resultNoSpace) {
            allTypes.push('normal')
          } else {
            allTypes.push('bold')
          }
        }
      } else {
        allTypes.push(apiData.types![resultIndex] || 'normal')
      }
      resultIndex++
    } else {
      allResults.push('')
      allTypes.push('normal')
    }
  }

  return { results: allResults, types: allTypes }
}