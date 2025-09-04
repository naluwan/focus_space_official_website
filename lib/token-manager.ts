/**
 * Instagram Token 智能管理器
 * 自動檢查並刷新 Token，無需資料庫
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface TokenInfo {
  token: string;
  expiresAt: Date;
  lastRefresh: Date;
  refreshCount: number;
}

class InstagramTokenManager {
  private cacheFile = path.join(process.cwd(), '.token-cache.json');
  private tokenInfo: TokenInfo | null = null;
  
  constructor() {
    this.loadTokenInfo();
  }

  /**
   * 載入 Token 資訊（從快取檔案）
   */
  private loadTokenInfo(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf8');
        const parsed = JSON.parse(data);
        this.tokenInfo = {
          ...parsed,
          expiresAt: new Date(parsed.expiresAt),
          lastRefresh: new Date(parsed.lastRefresh)
        };
      }
    } catch (error) {
      console.warn('[Token Manager] Failed to load token cache:', error);
      this.tokenInfo = null;
    }
  }

  /**
   * 儲存 Token 資訊（到快取檔案）
   */
  private saveTokenInfo(): void {
    try {
      if (this.tokenInfo) {
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.tokenInfo, null, 2));
      }
    } catch (error) {
      console.error('[Token Manager] Failed to save token cache:', error);
    }
  }

  /**
   * 獲取當前 Token
   */
  getCurrentToken(): string {
    return process.env.IG_TOKEN || '';
  }

  /**
   * 檢查 Token 是否即將過期（剩餘7天內）
   */
  isTokenExpiringSoon(): boolean {
    if (!this.tokenInfo) return true; // 沒有資訊時，假設需要檢查
    
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return this.tokenInfo.expiresAt < sevenDaysFromNow;
  }

  /**
   * 檢查是否需要刷新（避免頻繁刷新）
   */
  shouldRefresh(): boolean {
    if (!this.tokenInfo) return true;
    
    // 如果 Token 即將過期
    if (this.isTokenExpiringSoon()) return true;
    
    // 避免1小時內重複刷新
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (this.tokenInfo.lastRefresh > oneHourAgo) return false;
    
    return false;
  }

  /**
   * 自動刷新 Token
   */
  async autoRefreshToken(): Promise<{success: boolean; newToken?: string; message: string}> {
    const currentToken = this.getCurrentToken();
    
    if (!currentToken) {
      return { success: false, message: 'No token available' };
    }

    // 檢查是否需要刷新
    if (!this.shouldRefresh()) {
      return { 
        success: true, 
        message: 'Token is still valid, no refresh needed' 
      };
    }

    try {
      console.log('[Token Manager] Attempting to refresh Instagram token...');
      
      const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: currentToken
        },
        timeout: 10000 // 10秒超時
      });

      const { access_token, expires_in } = response.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);
      const daysLeft = Math.floor(expires_in / (24 * 60 * 60));

      // 更新快取資訊
      this.tokenInfo = {
        token: access_token,
        expiresAt,
        lastRefresh: new Date(),
        refreshCount: (this.tokenInfo?.refreshCount || 0) + 1
      };

      this.saveTokenInfo();

      console.log('[Token Manager] Token refresh successful:', {
        daysLeft,
        expiresAt: expiresAt.toISOString(),
        refreshCount: this.tokenInfo.refreshCount
      });

      return {
        success: true,
        message: `Token refreshed successfully. Valid for ${daysLeft} more days.`
      };

    } catch (error) {
      console.error('[Token Manager] Token refresh failed:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = error.response.data?.error?.message || 'Unknown error';
        return {
          success: false,
          message: `Token refresh failed: ${errorMsg}`
        };
      }
      
      return {
        success: false,
        message: `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 獲取 Token 狀態資訊
   */
  getTokenStatus(): {
    hasCache: boolean;
    isExpiringSoon: boolean;
    expiresAt?: string;
    daysLeft?: number;
    lastRefresh?: string;
    refreshCount?: number;
  } {
    if (!this.tokenInfo) {
      return {
        hasCache: false,
        isExpiringSoon: true
      };
    }

    const daysLeft = Math.floor((this.tokenInfo.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    return {
      hasCache: true,
      isExpiringSoon: this.isTokenExpiringSoon(),
      expiresAt: this.tokenInfo.expiresAt.toISOString(),
      daysLeft,
      lastRefresh: this.tokenInfo.lastRefresh.toISOString(),
      refreshCount: this.tokenInfo.refreshCount
    };
  }
}

// 單例模式
let tokenManager: InstagramTokenManager | null = null;

export function getTokenManager(): InstagramTokenManager {
  if (!tokenManager) {
    tokenManager = new InstagramTokenManager();
  }
  return tokenManager;
}

export { InstagramTokenManager };