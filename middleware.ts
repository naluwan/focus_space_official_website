// 暫時禁用 middleware 以避免無限遞迴問題
// 改用頁面級別的權限驗證

export const config = {
  matcher: [],  // 暫時禁用所有 middleware
};