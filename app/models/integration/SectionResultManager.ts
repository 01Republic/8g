type SectionResult = {
  result: any
  list?: any[]
}

const results: Record<string, SectionResult> = {}

export function setSectionResult(sectionId: string, data: SectionResult | any) {
  if (data && typeof data === 'object' && 'result' in data) {
    results[sectionId] = data as SectionResult
  } else {
    results[sectionId] = { result: data }
  }
}

export function getSectionResult(sectionId: string): SectionResult | undefined {
  return results[sectionId]
}

export function setSectionList(sectionId: string, list: any[]) {
  const prev = results[sectionId] || { result: undefined }
  results[sectionId] = { ...prev, list }
}

export function getAllSectionResults(): Record<string, SectionResult> {
  return results
}
