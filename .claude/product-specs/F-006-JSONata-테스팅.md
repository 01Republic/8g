# F-006: JSONata 테스팅

**기능 ID**: F-006
**우선순위**: P1 (High)
**상태**: ✅ 구현완료
**담당**: Frontend Team
**최종 수정일**: 2025-11-11

---

## 개요

JSONata 테스팅은 transform-data 블록에서 JSONata 표현식을 작성하고 실시간으로 테스트할 수 있는 기능입니다. 실행 결과를 자동으로 로드하여 표현식의 정확성을 즉시 검증할 수 있습니다.

**핵심 가치**:

- 데이터 변환 로직 검증
- 실시간 표현식 테스트
- 에러 즉시 확인
- 학습 곡선 단축

---

## 문서 인덱스

이 문서는 200줄 제한 준수를 위해 하위 문서로 분리되어 있습니다.

**상세 문서**:

- [JSONata 예제](./F-006-JSONata-테스팅/JSONata-예제.md) - 실제 사용 예제, 패턴, 데이터 변환 기법
- [JSONata 고급 활용](./F-006-JSONata-테스팅/JSONata-고급활용.md) - 고급 기능, 테스트, 디버깅, 최적화

---

## JSONata란?

**JSONata**: JSON 데이터 쿼리 및 변환을 위한 경량 표현 언어

**공식 사이트**: https://jsonata.org

**주요 기능**:

- JSON 데이터 필터링
- 데이터 변환 및 재구조화
- 집계 함수 (sum, count, average 등)
- 복잡한 조건부 로직

---

## transform-data 블록

### 블록 설정 구조

```typescript
{
  "name": "transform-data",
  "sourceData": string,        // JSONPath to source
  "expression": string          // JSONata expression
}
```

### 사용 예시

```json
{
  "id": "transform_results",
  "block": {
    "name": "transform-data",
    "sourceData": "$.steps.extract_data.result.data",
    "expression": "[status='active'].{ id: id, name: name }"
  }
}
```

---

## ExpressionFieldBlock 컴포넌트

**파일**: `app/client/admin/workflowBuilder/nodes/fieldBlock/ExpressionFieldBlock.tsx`

### 주요 기능

1. **표현식 입력**: JSONata 표현식 작성
2. **테스트 데이터 입력**: 수동 입력 또는 실행 결과 로드
3. **즉시 실행**: 표현식 실행 버튼으로 결과 확인
4. **에러 표시**: 문법/실행 에러 즉시 표시

### UI 구성

- JSONata 표현식 입력 필드
- 테스트 입력 데이터 (JSON)
- 액션 버튼: "표현식 실행", "실행결과 불러오기"
- 실행 결과 표시 영역 (읽기 전용)

### 데이터 추출

`extractDataFromResults()` 함수로 워크플로우 실행 결과에서 JSONPath로 데이터 추출. `context.steps`와 `result.steps` 경로 모두 지원.

---

## 빠른 참조

### 표현식 예시

**필터링**:

```jsonata
[status='active']
```

**필드 선택**:

```jsonata
*.{ "id": id, "name": name }
```

**집계**:

```jsonata
{ "total": $count(*), "sum": $sum(*.price) }
```

**자세한 예제**: [JSONata 예제](./F-006-JSONata-테스팅/JSONata-예제.md)

---

## 고급 기능

### 헬퍼 함수

```typescript
EightGClient.getStepResult(results, stepId);
EightGClient.getAllStepResults(results);
```

### 에러 처리

- Syntax Error: 문법 오류
- Type Error: 타입 불일치
- Invalid Path: 경로 오류

**자세한 내용**: [JSONata 고급 활용](./F-006-JSONata-테스팅/JSONata-고급활용.md)

---

## 향후 개선사항

- Q1 2025: 테스트 템플릿 라이브러리, 에러 메시지 개선
- Q2 2025: Monaco Editor 통합, 자동완성 지원, 에러 위치 하이라이트

---

## 관련 문서

- [JSONata 예제](./F-006-JSONata-테스팅/JSONata-예제.md)
- [JSONata 고급 활용](./F-006-JSONata-테스팅/JSONata-고급활용.md)
- [F-002: 블록 시스템](./F-002-블록-시스템.md)
- [F-007: 워크플로우 실행](./F-007-워크플로우-실행.md)
- [JSONata 공식 문서](https://docs.jsonata.org/)

---

## 파일 위치

- `app/client/admin/workflowBuilder/nodes/fieldBlock/ExpressionFieldBlock.tsx`
- `app/client/admin/workflowBuilder/nodes/BlockActionHandlerModal.tsx`

---

**변경 이력**

| 버전 | 날짜       | 변경 내용                                    | 작성자 |
| ---- | ---------- | -------------------------------------------- | ------ |
| 1.1  | 2025-11-11 | 200줄 제한 준수를 위해 예제와 고급 기능 분리 | System |
| 1.0  | 2025-11-11 | 최초 작성                                    | System |
