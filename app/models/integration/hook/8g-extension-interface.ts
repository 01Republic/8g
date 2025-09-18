/**
 * 8G Extension TypeScript Interface
 * 웹페이지에서 8G Extension과 통신하기 위한 타입 안전한 인터페이스
 * 우선 hook에 위치 시켜놨는데 나중에는 library 화 시킬예정 위치는 아직 미정
 */

// 기본 타입 정의
export type SelectorType = 'cssSelector' | 'xpath';

export interface BaseBlockParams {
  selector: string;
  findBy?: SelectorType;
  multiple?: boolean;
  waitForSelector?: boolean;
  waitSelectorTimeout?: number;
}

// 블록별 매개변수 타입
export interface GetTextParams extends BaseBlockParams {
  includeTags?: boolean;
  useTextContent?: boolean;
  regex?: string;
  prefixText?: string;
  suffixText?: string;
}

export interface AttributeValueParams extends BaseBlockParams {
  attributeName: string;
}

export interface ElementExistsParams extends BaseBlockParams {}

export interface EventClickParams extends BaseBlockParams {}

export interface SaveAssetsParams extends BaseBlockParams {}

export interface FormsParams extends BaseBlockParams {
  action?: 'get-value' | 'set-value';
  value?: string;
}

export interface JavaScriptCodeParams {
  code: string;
}

export interface LoopElementsParams extends BaseBlockParams {
  blocks: BlockConfig[];
}

// 블록 설정 타입들
export interface GetTextBlock {
  name: 'getText';
  saveKey: string;
  params: GetTextParams;
}

export interface AttributeValueBlock {
  name: 'attributeValue';
  saveKey: string;
  params: AttributeValueParams;
}

export interface ElementExistsBlock {
  name: 'elementExists';
  saveKey: string;
  params: ElementExistsParams;
}

export interface EventClickBlock {
  name: 'eventClick';
  saveKey: string;
  params: EventClickParams;
}

export interface SaveAssetsBlock {
  name: 'saveAssets';
  saveKey: string;
  params: SaveAssetsParams;
}

export interface FormsBlock {
  name: 'forms';
  saveKey: string;
  params: FormsParams;
}

export interface JavaScriptCodeBlock {
  name: 'javaScriptCode';
  saveKey: string;
  params: JavaScriptCodeParams;
}

export interface LoopElementsBlock {
  name: 'loopElements';
  saveKey: string;
  params: LoopElementsParams;
}

// 모든 블록 타입의 유니온
export type BlockConfig = 
  | GetTextBlock
  | AttributeValueBlock
  | ElementExistsBlock
  | EventClickBlock
  | SaveAssetsBlock
  | FormsBlock
  | JavaScriptCodeBlock
  | LoopElementsBlock;

// 결과 타입들
export interface ExtensionStatus {
  installed: boolean;
  version: string | null;
}

export interface BlockResult {
  blockName: string;
  saveKey: string;
  success: boolean;
  data: any;
  error: string | null;
}

export interface CollectionResultData {
  targetUrl: string;
  timestamp: string;
  tabId: number;
  result: {
    data: any[];
    blockResults: BlockResult[];
  };
}

export interface CollectionResult {
  success: boolean;
  result: CollectionResultData | { error: string; timestamp: string };
}

export interface CollectionOptions {
  closeTab?: boolean;
  timeout?: number;
  findBy?: SelectorType;
  multiple?: boolean;
  delay?: number;
  activateTab?: boolean;
}

export interface MultiPageResult {
  url: string;
  success: boolean;
  data?: any[];
  error?: string;
  timestamp: string;
}

// 메인 클래스
export class EightGExtension {
  private isInstalled: boolean = false;
  private version: string | null = null;
  private pendingRequests = new Map<string, { handler: (event: MessageEvent) => void; timeout: NodeJS.Timeout }>();

  /**
   * Extension 설치 여부 확인
   */
  async checkInstalled(): Promise<ExtensionStatus> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ installed: false, version: null });
      }, 3000);

      const handler = (event: MessageEvent) => {
        if (event.data.type === '8G_EXTENSION_RESPONSE') {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          
          this.isInstalled = event.data.installed;
          this.version = event.data.version;
          
          resolve({
            installed: event.data.installed,
            version: event.data.version
          });
        }
      };

      window.addEventListener('message', handler);
      
      window.postMessage({
        type: '8G_EXTENSION_CHECK'
      }, '*');
    });
  }

  /**
   * 데이터 수집 (항상 새탭)
   */
  async collectData(
    targetUrl: string,
    blocks: BlockConfig[],
    options: CollectionOptions = {}
  ): Promise<CollectionResultData> {
    if (!this.isInstalled) {
      throw new Error('8G Extension is not installed');
    }

    if (!targetUrl) {
      throw new Error('Target URL is required');
    }

    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
      throw new Error('Blocks array is required and must not be empty');
    }

    const requestId = this.generateRequestId();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout after 60 seconds'));
      }, 60000);

      const handler = (event: MessageEvent) => {
        if (event.data.type === '8G_COLLECT_RESPONSE' && event.data.requestId === requestId) {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          this.pendingRequests.delete(requestId);
          
          if (event.data.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.result.error || 'Collection failed'));
          }
        }
      };

      window.addEventListener('message', handler);
      this.pendingRequests.set(requestId, { handler, timeout });
      
      window.postMessage({
        type: '8G_COLLECT_DATA',
        data: {
          requestId,
          targetUrl,
          closeTabAfterCollection: options.closeTab !== false,
          activateTab: options.activateTab === true,
          blocks
        }
      }, '*');
    });
  }

  /**
   * ID와 텍스트 조합 수집 (편의 메서드)
   */
  async collectIdAndText(
    targetUrl: string,
    selector: string,
    options: CollectionOptions = {}
  ): Promise<Array<{ elementId: string; elementText: string; timestamp: string }>> {
    const blocks: BlockConfig[] = [
      {
        name: 'attributeValue',
        saveKey: 'elementId',
        params: {
          selector,
          findBy: options.findBy || 'cssSelector',
          attributeName: 'id',
          multiple: options.multiple !== false,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000
        }
      },
      {
        name: 'getText',
        saveKey: 'elementText',
        params: {
          selector,
          findBy: options.findBy || 'cssSelector',
          multiple: options.multiple !== false,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data;
  }

  /**
   * 텍스트만 수집 (편의 메서드)
   */
  async collectText(
    targetUrl: string,
    selector: string,
    options: CollectionOptions = {}
  ): Promise<string[]> {
    const blocks: BlockConfig[] = [
      {
        name: 'getText',
        saveKey: 'text',
        params: {
          selector,
          findBy: options.findBy || 'cssSelector',
          multiple: options.multiple !== false,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data.map(item => item.text);
  }

  /**
   * 속성값 수집 (편의 메서드)
   */
  async collectAttribute(
    targetUrl: string,
    selector: string,
    attributeName: string,
    options: CollectionOptions = {}
  ): Promise<string[]> {
    const blocks: BlockConfig[] = [
      {
        name: 'attributeValue',
        saveKey: 'attribute',
        params: {
          selector,
          findBy: options.findBy || 'cssSelector',
          attributeName,
          multiple: options.multiple !== false,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data.map(item => item.attribute);
  }

  /**
   * 요소 존재 확인 (편의 메서드)
   */
  async checkElementExists(
    targetUrl: string,
    selector: string,
    options: CollectionOptions = {}
  ): Promise<boolean> {
    const blocks: BlockConfig[] = [
      {
        name: 'elementExists',
        saveKey: 'exists',
        params: {
          selector,
          findBy: options.findBy || 'cssSelector',
          waitForSelector: false,
          waitSelectorTimeout: options.timeout || 1000
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data[0]?.exists || false;
  }

  /**
   * 여러 페이지에서 데이터 수집
   */
  async collectFromMultiplePages(
    urls: string[],
    blocks: BlockConfig[],
    options: CollectionOptions = {}
  ): Promise<MultiPageResult[]> {
    const results: MultiPageResult[] = [];
    const delay = options.delay || 1000;

    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`Collecting from page ${i + 1}/${urls.length}: ${urls[i]}`);
        const result = await this.collectData(urls[i], blocks, options);
        results.push({
          url: urls[i],
          success: true,
          data: result.result.data,
          timestamp: result.timestamp
        });
      } catch (error) {
        results.push({
          url: urls[i],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }

      // 마지막 페이지가 아니면 대기
      if (i < urls.length - 1) {
        await this.sleep(delay);
      }
    }

    return results;
  }

  /**
   * 상품 정보 수집 (전자상거래용 편의 메서드)
   */
  async collectProducts(
    targetUrl: string,
    productSelector: string,
    options: CollectionOptions = {}
  ): Promise<Array<{ name: string; price: string; image: string; link: string }>> {
    const blocks: BlockConfig[] = [
      {
        name: 'loopElements',
        saveKey: 'products',
        params: {
          selector: productSelector,
          findBy: options.findBy || 'cssSelector',
          multiple: true,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000,
          blocks: [
            {
              name: 'getText',
              saveKey: 'name',
              params: { selector: '.product-name, .title, h3, h4' }
            },
            {
              name: 'getText',
              saveKey: 'price',
              params: { selector: '.price, .cost, .amount' }
            },
            {
              name: 'attributeValue',
              saveKey: 'image',
              params: { selector: 'img', attributeName: 'src' }
            },
            {
              name: 'attributeValue',
              saveKey: 'link',
              params: { selector: 'a', attributeName: 'href' }
            }
          ]
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data[0]?.products || [];
  }

  /**
   * 뉴스 기사 수집 (뉴스 사이트용 편의 메서드)
   */
  async collectArticles(
    targetUrl: string,
    articleSelector: string,
    options: CollectionOptions = {}
  ): Promise<Array<{ headline: string; summary: string; link: string; author: string }>> {
    const blocks: BlockConfig[] = [
      {
        name: 'loopElements',
        saveKey: 'articles',
        params: {
          selector: articleSelector,
          findBy: options.findBy || 'cssSelector',
          multiple: true,
          waitForSelector: true,
          waitSelectorTimeout: options.timeout || 3000,
          blocks: [
            {
              name: 'getText',
              saveKey: 'headline',
              params: { selector: 'h1, h2, h3, .headline, .title' }
            },
            {
              name: 'getText',
              saveKey: 'summary',
              params: { selector: '.summary, .excerpt, .description, p' }
            },
            {
              name: 'attributeValue',
              saveKey: 'link',
              params: { selector: 'a', attributeName: 'href' }
            },
            {
              name: 'getText',
              saveKey: 'author',
              params: { selector: '.author, .writer, .byline' }
            }
          ]
        }
      }
    ];

    const result = await this.collectData(targetUrl, blocks, options);
    return result.result.data[0]?.articles || [];
  }

  /**
   * 요청 ID 생성
   */
  private generateRequestId(): string {
    return '8g-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 대기 함수
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 대기 중인 요청들 취소
   */
  cancelAllRequests(): void {
    for (const [requestId, request] of this.pendingRequests) {
      clearTimeout(request.timeout);
      window.removeEventListener('message', request.handler);
    }
    this.pendingRequests.clear();
  }
}

// 전역 인스턴스 생성 및 내보내기
export const EightG = new EightGExtension();

// 타입들도 내보내기 (라이브러리 사용자를 위해)
export * from './8g-extension-interface';

// 브라우저 환경에서 전역 객체에 추가
if (typeof window !== 'undefined') {
  (window as any).EightG = EightG;
  
  // 자동으로 Extension 설치 여부 확인
  EightG.checkInstalled().then(result => {
    console.log('8G Extension Status:', result);
  });
}