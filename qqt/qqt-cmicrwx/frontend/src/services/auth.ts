import http from "@/plugins/axios";

export interface ApiResponse<T = any> {
  status: number;
  msg?: string;
  data?: T;
  cookies?: Record<string, string>[];
}

export interface ProductItem {
  id: number;
  qyName: string;
  stock: number;
  transferable: number;
  levelable: string;
  phase: string;
  isRandom: boolean;
  status: number;
}

export interface FamilyMember {
  familyMemNum: string;
  showFamilyMemNum: string;
  familyMemName: string;
}

export const PRODUCT_PHASE_LABEL: Record<string, string> = {
  "1": "美食",
  "2": "生活",
  "3": "娱乐",
  "4": "知识",
};

export const PRODUCT_PHASE_LIST = Object.keys(PRODUCT_PHASE_LABEL);

export function sendSmsCode(phone: string, sspId?: string) {
  return http.post<ApiResponse>("/sms/send", { phone, sspId });
}

export function smsLogin(phone: string, smsCode: string, whiteList?: boolean) {
  return http.post<ApiResponse>("/login", { phone, smsCode, whiteList });
}

function withAccessToken(accessToken?: string) {
  return accessToken
    ? {
        headers: {
          "x-access-token": accessToken,
        },
      }
    : {};
}

export function fetchUserProfile(accessToken?: string) {
  return http.get<ApiResponse>("/user/profile", withAccessToken(accessToken));
}

export function logout() {
  return http.post("/logout");
}

export function fetchProducts(phase = "2", accessToken?: string) {
  return http.get<ApiResponse<{ prodList: ProductItem[]; phase: string }>>(
    "/products",
    {
      params: { phase },
      ...withAccessToken(accessToken),
    }
  );
}

export function redeemProduct(
  payload: {
    productId: number;
    receivePhone?: string;
    channelCode?: string;
    isRandom?: number;
    sourece?: number;
  },
  accessToken?: string
) {
  return http.post<ApiResponse>(
    "/products/redeem",
    payload,
    withAccessToken(accessToken)
  );
}

export function redeemStarDayProduct(
  payload: {
    productId: number;
  },
  accessToken?: string
) {
  return http.post<ApiResponse>(
    "/star-day/redeem",
    payload,
    withAccessToken(accessToken)
  );
}

export function fetchFamilyMembers(accessToken?: string) {
  return http.get<
    ApiResponse<{
      familyList: FamilyMember[];
      num?: number;
    }>
  >("/family", withAccessToken(accessToken));
}

export function applyManualToken(accessToken: string, maxAge = 7200) {
  return http.post<ApiResponse>("/manual/token", { accessToken, maxAge });
}
