# JSONata 고급 활용

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**상위 문서**: [F-006: JSONata 테스팅](../F-006-JSONata-테스팅.md)

---

## 개요

이 문서는 JSONata의 고급 기능, 테스트 방법, 디버깅 기법, 그리고 성능 최적화를 다룹니다.

---

## EightGClient 헬퍼 함수

### getStepResult 함수

```typescript
// scordi-extension SDK
export class EightGClient {
  static getStepResult(
    results: WorkflowExecutionResult,
    stepId: string
  ): any {
    return results.context?.steps?.[stepId]?.result?.data;
  }

  static getAllStepResults(
    results: WorkflowExecutionResult
  ): Record<string, any> {
    return results.context?.steps || {};
  }
}
```

### 사용 예시

```typescript
// 특정 스텝 결과 가져오기
const userData = EightGClient.getStepResult(results, 'extract_user');

// 모든 스텝 결과 가져오기
const allSteps = EightGClient.getAllStepResults(results);
```

---

## 데이터 추출 로직

### extractDataFromResults 함수

**구현**:
```typescript
function extractDataFromResults(
  results: WorkflowExecutionResult,
  sourceDataPath: string
): any {
  try {
    // context.steps와 result.steps 모두 지원
    const contextData = {
      steps: results.context?.steps || {},
      result: results
    };

    // JSONPath 실행
    const matches = JSONPath.query(contextData, sourceDataPath);
    return matches[0] || null;
  } catch (err) {
    console.error("Failed to extract data:", err);
    return null;
  }
}
```

### 지원하는 경로 형식

**context.steps 형식**:
```javascript
$.steps.extract_data.result.data
```

**result.steps 형식**:
```javascript
$.result.steps.extract_data.result.data
```

---

## 고급 JSONata 기능

### 함수 체이닝

```jsonata
$uppercase($trim($lowercase(name)))
```

### 변수 바인딩

```jsonata
(
  $threshold := 100;
  $filtered := [price > $threshold];
  $filtered.{ "id": id, "name": name }
)
```

### 커스텀 함수 정의

```jsonata
(
  $isExpensive := function($p) { $p > 200 };
  *[isExpensive(price)]
)
```

### 재귀 처리

```jsonata
(
  $flatten := function($arr) {
    $type($arr) = "array" ?
      $reduce($arr, function($a, $b) {
        $append($a, $flatten($b))
      }, []) :
      [$arr]
  };
  $flatten(nestedArray)
)
```

---

## 테스트 전략

### 단계별 테스트

1. **입력 데이터 검증**
   - 실행 결과가 올바른 구조인지 확인
   - 필수 필드 존재 여부 확인

2. **표현식 단위 테스트**
   - 간단한 표현식부터 시작
   - 점진적으로 복잡도 증가

3. **엣지 케이스 테스트**
   - 빈 배열
   - null/undefined 값
   - 잘못된 타입

### 테스트 케이스 예시

```typescript
// 테스트 케이스 1: 빈 배열
const emptyArray = [];
// 표현식: [status='active']
// 기대 결과: []

// 테스트 케이스 2: null 값
const dataWithNull = [
  { id: 1, name: null, price: 100 }
];
// 표현식: *.{ "name": name ? name : "Unknown" }
// 기대 결과: [{ "name": "Unknown" }]

// 테스트 케이스 3: 중첩 null
const nestedNull = {
  user: { profile: null }
};
// 표현식: user.profile.name
// 기대 결과: null (에러 없이)
```

---

## 디버깅 기법

### 1. 단계별 분해

복잡한 표현식을 단계별로 나누어 테스트:

```jsonata
/* 원본 */
$sum([status='active' and price > 100].price)

/* 단계 1: 필터링 */
[status='active' and price > 100]

/* 단계 2: 필드 추출 */
[status='active' and price > 100].price

/* 단계 3: 집계 */
$sum([status='active' and price > 100].price)
```

### 2. 중간 결과 확인

```jsonata
{
  "filtered": [status='active'],
  "count": $count([status='active']),
  "result": [status='active'].name
}
```

### 3. 타입 확인

```jsonata
*.{
  "value": fieldName,
  "type": $type(fieldName)
}
```

---

## 에러 처리

### 일반적인 에러

**1. Syntax Error**
```
Error: Expected "," or "]" at column 15
```
**해결**: 문법 오류 확인, 괄호/따옴표 짝 맞추기

**2. Type Error**
```
Error: Attempted to invoke a non-function
```
**해결**: 함수 이름 확인, 괄호 사용 여부 확인

**3. Invalid Path**
```
Error: Path does not exist
```
**해결**: JSONPath 표현식 확인, 데이터 구조 검증

**4. Division by Zero**
```
Error: Division by zero
```
**해결**: 조건문으로 0 체크

### 안전한 표현식 작성

```jsonata
/* 안전하지 않음 */
value / count

/* 안전함 */
count > 0 ? value / count : 0
```

---

## 성능 최적화

### 1. 대용량 데이터 처리

**문제**: 10,000개 이상 아이템 처리 시 느림

**해결책**:
- 필터링을 먼저 수행하여 데이터 크기 축소
- 불필요한 필드 제거
- 중첩 루프 최소화

```jsonata
/* 비효율적 */
*.*.*.value

/* 효율적 */
[status='active'].essentialFields.value
```

### 2. 복잡한 표현식 최적화

**문제**: 동일한 계산 반복

**해결책**: 변수 바인딩 사용

```jsonata
/* 비효율적 */
{
  "avg": $average(*.price),
  "aboveAvg": [price > $average($$.*.price)]
}

/* 효율적 */
(
  $avg := $average(*.price);
  {
    "avg": $avg,
    "aboveAvg": [price > $avg]
  }
)
```

---

## 테스트 템플릿 (향후 구현)

### 자주 사용하는 템플릿

```typescript
const JSONATA_TEMPLATES = {
  "필터링": "[condition]",
  "필드 선택": "*.{ newKey: oldKey }",
  "집계": "$sum(*.field)",
  "중복 제거": "$distinct(*.field)",
  "정렬": "^(field)",
  "조인": "$join(*.field, ', ')",
  "그룹핑": "${ key: value }",
  "평탄화": "*.nested[].field"
};
```

---

## 자동완성 지원 (향후 구현)

### JSONata 함수 목록

```typescript
const JSONATA_FUNCTIONS = [
  // 집계
  "$count()", "$sum()", "$average()", "$min()", "$max()",

  // 배열
  "$distinct()", "$append()", "$reverse()", "$shuffle()",

  // 문자열
  "$join()", "$split()", "$substring()", "$length()",
  "$uppercase()", "$lowercase()", "$trim()",

  // 타입
  "$number()", "$string()", "$boolean()", "$type()",

  // 날짜
  "$now()", "$millis()", "$fromMillis()",

  // 기타
  "$exists()", "$sort()", "$reduce()", "$map()"
];
```

---

## 알려진 제한사항

### 1. 재귀 깊이 제한

JSONata는 재귀 깊이가 제한되어 있습니다 (일반적으로 500).

**해결책**: 반복문 사용 또는 데이터 구조 재설계

### 2. 메모리 제약

대용량 데이터 처리 시 브라우저 메모리 제약이 있습니다.

**해결책**: 데이터를 청크로 나누어 처리

### 3. 비동기 작업 불가

JSONata는 동기식으로만 동작합니다.

**해결책**: 비동기 작업은 워크플로우 스텝 레벨에서 처리

---

## 관련 문서

- [F-006: JSONata 테스팅](../F-006-JSONata-테스팅.md)
- [JSONata 예제](./JSONata-예제.md)
- [JSONata 공식 문서](https://docs.jsonata.org/)
- [JSONata Exerciser](https://try.jsonata.org/)

---

**변경 이력**

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|-------|
| 1.0 | 2025-11-11 | F-006에서 고급 활용 부분 분리 | System |
