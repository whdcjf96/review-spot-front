// 상품 타입
export interface Product {
  product_id: number;
  product_name: string;
  img_path: string;
  alcohol: number;
  capacity: number;
  area: string;
  category: {
    id: number;
    name: string;
    created: string;
    updated: string;
  }
}

// 상품 상세 정보 타입
export interface ProductInfo {
  product_id: number;
  img_path: string;
  product_name: string;
  category: {
    id: number;
    name: string;
    created: string;
    updated: string;
  }
  capacity: number;
  alcohol: number;
  area: string;
  distillery: string // 증류소
  bottler: string // 병입업자
  bottling_serie: string // 병입 시리즈
  bottled: string // 병입년도
  cask_type: string // 오크통 유형
}
// 아로마 프로필 타입
export interface AromaProfile {
  labels: string[];
  data: number[];
}

// 리뷰 타입
export interface ReviewItem {
  id: number;
  nickname: string;
  avgScore: number;
  noseScore: number;
  palateScore: number;
  finishScore: number;
  content: string;
  createdAt: string;
  product: Product;
  aromaProfile: AromaProfile;
}

// 리뷰 폼 데이터 타입
export interface ReviewFormData {
  product_id?: number;
  nose_score: number;
  palate_score: number;
  finish_score: number;
  content: string;
  aroma_labels: string[];
  aroma_scores: { [key: string]: number };
}

// 리뷰 아이템 컴포넌트 프롭스
export interface ReviewsItemComponentProps {
  item: ReviewItem;
}

// 리뷰 리스트 컴포넌트 프롭스
export interface ReviewsListComponentProps {
  items: ReviewItem[];
}

// 레이더 차트 데이터 타입
export interface RadarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
  }[];
}

// 리뷰 데이터에서 레이더 차트 데이터를 추출하는 함수
export interface WhiskyRadarChartProps {
  data: RadarChartData;
}

// 페이지네이션 컴포넌트 프롭스
export interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}
