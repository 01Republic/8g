# 워크플로우 JSON 명세

**문서 버전**: 1.1
**최종 수정일**: 2025-11-11
**상위 문서**: [PRD](../PRD.md)

---

## 개요

워크플로우 JSON은 8G 플랫폼의 자동화 로직을 정의하는 핵심 데이터 구조입니다. 이 명세는 워크플로우의 모든 요소(스텝, 블록, 조건, 루프 등)를 정의합니다.

---

## 문서 인덱스

이 문서는 200줄 제한 준수를 위해 하위 문서로 분리되어 있습니다.

**상세 문서**:

- [스텝 정의](./워크플로우-JSON-명세/스텝-정의.md) - WorkflowStep 구조, Block 타입, 필드 상세
- [고급 기능](./워크플로우-JSON-명세/고급-기능.md) - repeat, switch, retry, parser, vars

---

## 최상위 구조

```typescript
interface FormWorkflow {
  version: string; // "1.0"
  start: string; // 시작 스텝 ID
  steps: WorkflowStep[]; // 워크플로우 스텝 배열
  targetUrl?: string; // 타겟 웹사이트 URL
  parser?: ParserConfig; // 출력 변환 설정
  vars?: Record<string, any>; // 변수 정의
}
```

---

## WorkflowStep 개요

**필수 필드**: id, block
**선택 필드**: repeat, switch, next, delayAfterMs, retry, timeoutMs

**상세**: [스텝 정의](./워크플로우-JSON-명세/스텝-정의.md)

---

## Block 개요

**구조**: name (필수) + 블록별 설정

**주요 블록 타입**:

- 데이터 추출: get-text, attribute-value, get-element-data, get-value-form
- 인터랙션: event-click, keypress, scroll
- 제어 흐름: wait, element-exists
- 통합: fetch-api, transform-data

**상세**: [스텝 정의](./워크플로우-JSON-명세/스텝-정의.md)

---

## 고급 기능

### RepeatConfig

**forEach**: 배열 순회 루프
**count**: 고정 횟수 반복

### SwitchCase

**조건 타입**: equals, regex, contains, exists, and, or

### RetryConfig

**설정**: attempts, delayMs, backoff (linear/exponential)

### ParserConfig

**출력 변환**: JSONPath 표현식

### Variables

**정적**: `${vars.key}`
**동적**: `${$.steps.xxx.result.data}`

**상세**: [고급 기능](./워크플로우-JSON-명세/고급-기능.md)

---

## 완전한 예시

```json
{
  "version": "1.0",
  "start": "login",
  "steps": [
    {
      "id": "login",
      "block": {
        "name": "keypress",
        "selector": "#email",
        "value": "${vars.email}"
      },
      "next": "submit"
    },
    {
      "id": "submit",
      "block": { "name": "event-click", "selector": "button" },
      "delayAfterMs": 2000,
      "retry": { "attempts": 3 },
      "next": "check"
    },
    {
      "id": "check",
      "block": { "name": "element-exists", "selector": ".dashboard" },
      "switch": [
        {
          "when": {
            "equals": {
              "left": "$.steps.check.result.data.exists",
              "right": true
            }
          },
          "next": "extract"
        }
      ]
    }
  ],
  "targetUrl": "https://example.com",
  "parser": { "expression": "$.steps.extract.result.data" },
  "vars": { "email": "user@example.com" }
}
```

**전체 예시**: [고급 기능](./워크플로우-JSON-명세/고급-기능.md)

---

## 유효성 검증

Zod 스키마를 사용한 워크플로우 검증이 향후 구현 예정입니다.

---

## 관련 문서

- [스텝 정의](./워크플로우-JSON-명세/스텝-정의.md)
- [고급 기능](./워크플로우-JSON-명세/고급-기능.md)
- [PRD](../PRD.md)
- [F-002: 블록 시스템](../product-specs/F-002-블록-시스템.md)
- [F-003: 조건부 분기](../product-specs/F-003-조건부-분기.md)

---

**변경 이력**

| 버전 | 날짜       | 변경 내용                                         | 작성자 |
| ---- | ---------- | ------------------------------------------------- | ------ |
| 1.1  | 2025-11-11 | 200줄 제한 준수를 위해 스텝 정의와 고급 기능 분리 | System |
| 1.0  | 2025-11-11 | 최초 작성                                         | System |
