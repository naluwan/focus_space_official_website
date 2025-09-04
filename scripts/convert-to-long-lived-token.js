/**
 * 將短期 Instagram Access Token 轉換為長期 Token (60天)
 * 使用方法：node scripts/convert-to-long-lived-token.js
 */

const axios = require('axios');
require('dotenv').config();

async function convertToLongLivedToken() {
  // 從環境變數讀取當前 token
  const currentToken = process.env.IG_TOKEN;
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!currentToken) {
    console.error('❌ 找不到 IG_TOKEN 環境變數');
    process.exit(1);
  }

  if (!appId || !appSecret) {
    console.error('❌ 需要設定 FACEBOOK_APP_ID 和 FACEBOOK_APP_SECRET');
    console.log('💡 請到 Facebook Developer Console 取得這些資訊');
    process.exit(1);
  }

  try {
    console.log('🔄 正在將短期 token 轉換為長期 token...');
    console.log(`📱 App ID: ${appId}`);
    console.log(`🔑 Current Token: ${currentToken.substring(0, 20)}...`);

    const response = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: currentToken,
      },
    });

    const data = response.data;

    if (data.error) {
      console.error('❌ 轉換失敗:', data.error);
      return;
    }

    const longLivedToken = data.access_token;
    const expiresIn = data.expires_in; // 秒為單位
    const expiresInDays = Math.floor(expiresIn / (24 * 60 * 60));

    console.log('✅ 轉換成功！');
    console.log(`📅 有效期限: ${expiresInDays} 天`);
    console.log('🔑 長期 Token:');
    console.log(longLivedToken);
    console.log('\n📝 請更新 .env 檔案中的 IG_TOKEN 為上面的值');

    // 計算過期日期
    const expiryDate = new Date(Date.now() + expiresIn * 1000);
    console.log(`⏰ 過期時間: ${expiryDate.toLocaleString()}`);

    // 建議下次更新時間（提前 7 天）
    const suggestedUpdateDate = new Date(
      Date.now() + (expiresIn - 7 * 24 * 60 * 60) * 1000,
    );
    console.log(`🔔 建議更新時間: ${suggestedUpdateDate.toLocaleString()}`);
  } catch (error) {
    console.error('❌ 發生錯誤:', error.message);

    if (error.response) {
      console.error('📄 錯誤詳情:', error.response.data);
      console.error('🔍 狀態碼:', error.response.status);
    }

    console.log('\n💡 可能的解決方案:');
    console.log('1. 檢查 IG_TOKEN 是否為有效的短期 token');
    console.log('2. 確認 FACEBOOK_APP_SECRET 是否正確');
    console.log('3. 確保 Instagram App 設定正確');
    console.log('4. 檢查是否有必要的權限 (instagram_basic)');
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  convertToLongLivedToken();
}

module.exports = { convertToLongLivedToken };
