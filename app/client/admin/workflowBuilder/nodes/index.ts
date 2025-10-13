import type { NodeTypes } from "@xyflow/react";
import GenericBlockNode from "./GenericBlockNode";
import { AllBlockSchemas } from "8g-extension";

// 모든 블록 타입을 GenericBlockNode로 자동 등록
export const workflowNodeTypes: NodeTypes = Object.keys(AllBlockSchemas).reduce(
  (acc, blockName) => {
    acc[blockName] = GenericBlockNode;
    return acc;
  },
  {} as NodeTypes
);

/**
 * Block 이름에 따른 한글 라벨 매핑
 */
export const blockLabels: Record<string, { title: string; description: string }> = {
  "get-text": {
    title: "텍스트 추출",
    description: "요소의 텍스트 추출",
  },
  "attribute-value": {
    title: "속성 값 추출",
    description: "요소의 속성 값 추출",
  },
  "get-value-form": {
    title: "폼 값 가져오기",
    description: "입력 필드 값 추출",
  },
  "set-value-form": {
    title: "폼 값 설정",
    description: "입력 필드 값 설정",
  },
  "clear-value-form": {
    title: "폼 값 초기화",
    description: "입력 필드 초기화",
  },
  "element-exists": {
    title: "요소 존재 확인",
    description: "요소 존재 여부 확인",
  },
  "event-click": {
    title: "클릭 이벤트",
    description: "요소 클릭",
  },
  "save-assets": {
    title: "에셋 저장",
    description: "이미지/미디어 URL 추출",
  },
  "get-element-data": {
    title: "요소 데이터 추출",
    description: "텍스트/속성/셀렉터 추출",
  },
  "scroll": {
    title: "스크롤",
    description: "스크롤",
  },
  "ai-parse-data": {
    title: "AI 데이터 파싱",
    description: "AI 데이터 파싱",
  },
  "keypress": {
    title: "키 입력",
    description: "키 입력",
  },
  "wait": {
    title: "대기",
    description: "대기",
  },
  "fetch-api": {
    title: "API 호출",
    description: "API 호출",
  },
  "data-extract": {
    title: "데이터 추출/변환",
    description: "JavaScript로 데이터 추출 및 변환",
  },
};

/**
 * 필드 이름에 따른 한글 라벨
 */
export const fieldLabels: Record<string, string> = {
  name: "블록 타입",
  selector: "셀렉터",
  findBy: "찾기 방식",
  option: "옵션",
  waitForSelector: "셀렉터 대기",
  waitSelectorTimeout: "대기 시간 (ms)",
  multiple: "다중 선택",
  
  // GetTextBlock
  includeTags: "HTML 태그 포함",
  useTextContent: "textContent 사용",
  regex: "정규식 필터",
  prefixText: "접두사",
  suffixText: "접미사",
  
  // EventClickBlock
  textFilter: "텍스트 필터",
  
  // GetAttributeValueBlock
  attributeName: "속성 이름",
  
  // SetValueFormBlock
  setValue: "설정할 값",
  type: "폼 타입",
  
  // GetElementDataBlock
  includeText: "텍스트 포함",
  attributes: "추출할 속성 목록",
  includeSelector: "셀렉터 생성",
  includeXPath: "XPath 생성",
  
  // FetchApiBlock
  url: "URL",
  method: "HTTP 메서드",
  headers: "헤더",
  body: "요청 본문",
  timeout: "타임아웃 (ms)",
  parseJson: "JSON 파싱",
  returnHeaders: "응답 헤더 반환",
  
  // DataExtractBlock
  code: "JavaScript 코드",
  inputData: "입력 데이터",
};
