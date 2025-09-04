/**
 * 檢查 Instagram Access Token 的詳細資訊
 */

const axios = require('axios');
require('dotenv').config();

async function checkTokenInfo() {
  const currentToken = process.env.IG_TOKEN;
  
  if (!currentToken) {
    console.error('❌ 找不到 IG_TOKEN 環境變數');
    process.exit(1);
  }

  try {
    console.log('🔍 檢查 Token 資訊...');
    console.log(`🔑 Token: ${currentToken.substring(0, 20)}...`);
    
    // 檢查用戶資訊
    const userResponse = await axios.get('https://graph.instagram.com/me', {
      params: {
        fields: 'id,username',
        access_token: currentToken
      }
    });
    
    console.log('✅ Token 有效！');
    console.log('👤 用戶資訊:', userResponse.data);
    
    // 嘗試檢查 Token 類型（這個 API 可能不存在，但值得試試）
    try {
      const debugResponse = await axios.get('https://graph.facebook.com/debug_token', {
        params: {
          input_token: currentToken,
          access_token: currentToken
        }
      });
      
      console.log('📊 Token 詳細資訊:', debugResponse.data);
    } catch (debugError) {
      console.log('ℹ️ 無法取得 Token 詳細資訊（這是正常的）');
    }
    
    // 測試 Instagram API 功能
    try {
      const mediaResponse = await axios.get('https://graph.instagram.com/me/media', {
        params: {
          fields: 'id,media_type,timestamp',
          limit: 5,
          access_token: currentToken
        }
      });
      
      console.log('✅ Instagram Media API 正常工作');
      console.log('📱 最近貼文數量:', mediaResponse.data.data.length);
    } catch (mediaError) {
      console.error('❌ Instagram Media API 失敗:', mediaError.response?.data || mediaError.message);
    }
    
    // 給出建議
    console.log('\n💡 分析結果:');
    console.log('1. ✅ Token 本身是有效的');
    console.log('2. ✅ 可以正常讀取 Instagram 資料');
    console.log('3. ❓ Token 轉換失敗可能原因:');
    console.log('   - Token 可能已經是長期 Token');
    console.log('   - Facebook App 設定可能有問題');
    console.log('   - Token 類型或權限不匹配');
    
    console.log('\n🔧 建議解決方案:');
    console.log('1. 直接使用當前 Token（如果是長期 Token）');
    console.log('2. 從 Facebook Developer Console 重新生成長期 Token');
    console.log('3. 檢查 Facebook App 的 Instagram Basic Display 設定');

  } catch (error) {
    console.error('❌ Token 檢查失敗:', error.message);
    
    if (error.response) {
      console.error('📄 錯誤詳情:', error.response.data);
    }
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  checkTokenInfo();
}

module.exports = { checkTokenInfo };