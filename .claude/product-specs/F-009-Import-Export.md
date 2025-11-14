# F-009: Import/Export

**기능 ID**: F-009
**우선순위**: P1 (High)
**상태**: ✅ 구현완료
**담당**: Frontend Team
**최종 수정일**: 2025-11-11

---

## 개요

Import/Export는 워크플로우 정의와 실행 결과를 파일로 내보내고 가져올 수 있는 기능입니다. JSON 형식의 워크플로우 파일과 CSV 형식의 데이터 Export를 지원합니다.

**핵심 가치**:

- 워크플로우 백업 및 복원
- 워크플로우 공유
- 데이터 외부 활용
- 버전 관리

---

## 문서 인덱스

이 문서는 200줄 제한 준수를 위해 하위 문서로 분리되어 있습니다.

**상세 문서**:

- [가져오기 프로세스](./F-009-Import-Export/가져오기-프로세스.md) - Import UI, 파일 업로드, 검증, 로드
- [내보내기 프로세스](./F-009-Import-Export/내보내기-프로세스.md) - Export UI, JSON/CSV 포맷, 클립보드

---

## 빠른 참조

### 워크플로우 Export

```typescript
// React Flow 그래프 → JSON 다운로드
const workflow = buildWorkflowJson(nodes, edges, targetUrl);
exportWorkflow(workflow, workflowId);
```

**파일명**: `workflow-{id}-{timestamp}.json`
**UI 위치**: 워크플로우 빌더 헤더

### 워크플로우 Import

```typescript
// JSON 파일 업로드 → React Flow 그래프
const workflow = await file.text();
const validated = WorkflowSchema.parse(JSON.parse(workflow));
loadWorkflowFromJSON(validated);
```

**UI 위치**: 워크플로우 빌더 헤더

### 실행 결과 Export

**CSV**:

```typescript
exportResultsToCSV(results); // UTF-8 with BOM
```

**JSON**:

```typescript
exportResultsToJSON(results);
```

**UI 위치**: ResultPanel 하단

---

## 주요 기능

### 워크플로우 Import/Export

**지원 형식**: JSON (FormWorkflow 구조)
**검증**: Zod 스키마 + 비즈니스 규칙 검증

**Import**: 파일 업로드 → 검증 → 그래프 로드
**Export**: React Flow → JSON 변환 → 다운로드

**상세**:

- [가져오기 프로세스](./F-009-Import-Export/가져오기-프로세스.md)
- [내보내기 프로세스](./F-009-Import-Export/내보내기-프로세스.md)

### 실행 결과 Export

**CSV**: UTF-8 with BOM, Excel 호환
**JSON**: WorkflowExecutionResult 전체

**상세**: [내보내기 프로세스](./F-009-Import-Export/내보내기-프로세스.md)

---

## 클립보드 통합

### 복사

```typescript
// Ctrl/Cmd + Shift + C
await navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
```

### 붙여넣기

```typescript
// Ctrl/Cmd + Shift + V
const text = await navigator.clipboard.readText();
const workflow = WorkflowSchema.parse(JSON.parse(text));
loadWorkflowFromJSON(workflow);
```

**상세**: [내보내기 프로세스 - 클립보드 통합](./F-009-Import-Export/내보내기-프로세스.md#클립보드-통합)

---

## 에러 처리

### Import 에러

1. **잘못된 JSON**: "유효하지 않은 JSON 파일입니다."
2. **스키마 검증 실패**: Zod 에러 메시지 표시
3. **비즈니스 규칙 위반**: 순환 참조, 잘못된 참조 등
4. **버전 호환성**: 지원하지 않는 버전 경고

**상세**: [가져오기 프로세스 - 에러 처리](./F-009-Import-Export/가져오기-프로세스.md#에러-처리)

### Export 에러

1. **데이터 없음**: "Export할 데이터가 없습니다."
2. **대용량 처리**: 10,000개 이상 행에서 지연 발생

---

## 향후 개선사항

### Q1 2025

- 블록별 상세 검증
- Import 미리보기
- Export 옵션 UI
- 워크플로우 템플릿 라이브러리

### Q2 2025

- 버전 관리 시스템
- 일괄 Import/Export
- 압축 파일 지원 (ZIP)
- Excel Export 지원 (xlsx)
- Web Worker 사용 (대용량 처리)

---

## 알려진 이슈

**Issue-001: 대용량 CSV Export 느림**

- **증상**: 10,000개 이상 행 처리 시 지연
- **대안**: 결과 분할 Export
- **계획**: Q2 2025 - Web Worker 사용

**Issue-002: Import 시 검증 부족**

- **증상**: 블록별 세부 검증 없음
- **대안**: 수동 확인
- **계획**: Q1 2025 - 블록별 스키마 검증

---

## 관련 문서

- [가져오기 프로세스](./F-009-Import-Export/가져오기-프로세스.md) - Import 상세
- [내보내기 프로세스](./F-009-Import-Export/내보내기-프로세스.md) - Export 상세
- [F-001: 워크플로우 빌더](./F-001-워크플로우-빌더.md) - 빌더 UI
- [F-008: 결과 시각화](./F-008-결과-시각화.md) - 결과 표시
- [워크플로우 JSON 명세](../prd/워크플로우-JSON-명세.md) - JSON 구조

---

## 파일 위치

### Import

- `app/client/admin/workflowBuilder/WorkflowImportButton.tsx` - Import 버튼
- `app/client/admin/workflowBuilder/schemas/WorkflowSchema.ts` - Zod 스키마
- `app/client/admin/workflowBuilder/utils/workflowLoader.ts` - 로드 로직

### Export

- `app/client/admin/workflowBuilder/WorkflowBuilderHeader.tsx` - Export 버튼
- `app/client/admin/workflowBuilder/ResultPanel.tsx` - CSV/JSON Export
- `app/models/workflow/WorkflowBuilder.ts` - JSON 변환 로직

---

**변경 이력**

| 버전 | 날짜       | 변경 내용                             | 작성자 |
| ---- | ---------- | ------------------------------------- | ------ |
| 1.2  | 2025-11-11 | 200줄 제한 준수를 위해 상세 설명 축소 | System |
| 1.1  | 2025-11-11 | 200줄 제한 준수를 위한 하위 문서 분리 | System |
| 1.0  | 2025-11-11 | 최초 작성                             | System |
