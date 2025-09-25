export type Product = {
    id: number;
    nameKo: string;
    nameEn: string;
    tagline: string | null;
    image: string;
    productTags: Array<{
      tag: {
        name: string;
      };
    }>;
  }