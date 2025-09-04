// API 錯誤類型定義

export interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: {
    [key: string]: {
      message: string;
      path: string;
      value: unknown;
      kind?: string;
    };
  };
}

export interface MongooseCastError extends Error {
  name: 'CastError';
  path: string;
  value: unknown;
  kind: string;
}

export interface MongooseDuplicateKeyError extends Error {
  name: 'MongoServerError';
  code: 11000;
  keyPattern: Record<string, number>;
  keyValue: Record<string, unknown>;
}

// 統一的錯誤處理函數
export function handleApiError(error: unknown): {
  message: string;
  status: number;
} {
  console.error('API Error:', error);

  // Mongoose 驗證錯誤
  if (error instanceof Error && error.name === 'ValidationError') {
    const validationError = error as MongooseValidationError;
    const validationMessages = Object.values(validationError.errors)
      .map((err) => err.message)
      .join(', ');
    return {
      message: validationMessages,
      status: 400
    };
  }

  // Mongoose Cast 錯誤 (無效的 ObjectId 等)
  if (error instanceof Error && error.name === 'CastError') {
    return {
      message: '無效的資料格式',
      status: 400
    };
  }

  // MongoDB 重複鍵錯誤
  if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
    return {
      message: '資料已存在，無法重複新增',
      status: 409
    };
  }

  // 一般錯誤
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    };
  }

  // 未知錯誤
  return {
    message: '伺服器內部錯誤',
    status: 500
  };
}