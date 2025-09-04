'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface GoogleMapProps {
  address: string;
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address,
  lat,
  lng,
  zoom = 16,
  height = '300px',
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          console.error('Google Maps API Key not found');
          setMapError(true);
          return;
        }

        // 檢查是否已經載入 Google Maps
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }

        // 檢查是否已經有 script 標籤在載入中
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          // 如果 script 已存在，檢查 Google Maps API 是否已載入
          const checkExistingGoogleMaps = () => {
            if (window.google && window.google.maps && window.google.maps.Map) {
              initializeMap();
            } else {
              // 如果還未載入，等待 script 載入完成
              existingScript.addEventListener('load', () => {
                const checkGoogleMaps = () => {
                  if (window.google && window.google.maps && window.google.maps.Map) {
                    initializeMap();
                  } else {
                    setTimeout(checkGoogleMaps, 100);
                  }
                };
                checkGoogleMaps();
              });
            }
          };
          checkExistingGoogleMaps();
          return;
        }

        // 載入 Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        
        script.onload = () => {
          // 等待 Google Maps API 完全初始化
          let attempts = 0;
          const maxAttempts = 50; // 5 秒鐘
          const checkGoogleMaps = () => {
            attempts++;
            if (window.google && window.google.maps && window.google.maps.Map) {
              console.log('Google Maps loaded successfully');
              initializeMap();
            } else if (attempts < maxAttempts) {
              // 如果還未載入完成，再等一下
              setTimeout(checkGoogleMaps, 100);
            } else {
              console.error('Google Maps failed to load after timeout');
              setMapError(true);
            }
          };
          checkGoogleMaps();
        };

        script.onerror = () => {
          console.error('Failed to load Google Maps');
          setMapError(true);
        };

        document.head.appendChild(script);

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(true);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps || !window.google.maps.Map) {
        console.error('Google Maps API not fully loaded');
        setMapError(true);
        return;
      }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
          styles: [
            // 自訂地圖樣式，符合品牌色彩
            {
              'featureType': 'poi',
              'elementType': 'labels.text',
              'stylers': [{ 'visibility': 'off' }]
            },
            {
              'featureType': 'poi.business',
              'stylers': [{ 'visibility': 'off' }]
            },
            {
              'featureType': 'road',
              'elementType': 'labels.icon',
              'stylers': [{ 'visibility': 'off' }]
            },
            {
              'featureType': 'transit',
              'stylers': [{ 'visibility': 'simplified' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: false,
          fullscreenControl: true
        });

        // 添加自訂標記
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: 'Focus Space 健身房',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="#fff" stroke-width="2"/>
                <path d="M20 10 L20 30 M10 20 L30 20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

        // 添加資訊視窗
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; font-family: Arial, sans-serif; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #dc2626; font-size: 16px; font-weight: bold;">Focus Space 專心練</h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 13px; line-height: 1.4;">${address}</p>
              <div style="margin: 8px 0; padding: 6px 8px; background: #f3f4f6; border-radius: 6px;">
                <p style="margin: 0; color: #374151; font-size: 12px; font-weight: 500;">📞 02 2258 8228</p>
                <p style="margin: 4px 0 0 0; color: #374151; font-size: 12px; font-weight: 500;">⏰ 07:00 - 23:00</p>
              </div>
              <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 11px;">板橋捷運新埔站五號出口</p>
            </div>
          `
        });

        // 點擊標記顯示資訊
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        setMapLoaded(true);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    loadGoogleMaps();

  }, [lat, lng, zoom, address]);

  // 開啟 Google Maps 導航
  const openGoogleMapsNavigation = () => {
    // 使用店名搜尋，這樣會導航到店家而非只是地址
    const query = encodeURIComponent('Focus Space 專心練 板橋新埔');
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 開啟 Google Maps 檢視
  const openGoogleMapsView = () => {
    // 使用店名搜尋而非經緯度，這樣會顯示店家資訊
    const query = encodeURIComponent('Focus Space 專心練 板橋新埔');
    const url = `https://www.google.com/maps/search/${query}/@${lat},${lng},17z`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (mapError) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className='w-full h-full bg-gray-100 rounded-xl flex flex-col items-center justify-center p-6 border border-gray-200'>
          <MapPin className='w-12 h-12 text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>地圖暫時無法載入</h3>
          <p className='text-sm text-gray-500 text-center mb-4'>
            {address}
          </p>
          <div className='flex gap-2'>
            <button
              onClick={openGoogleMapsView}
              className='bg_brand_gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-2'
            >
              <ExternalLink className='w-4 h-4' />
              查看地圖
            </button>
            <button
              onClick={openGoogleMapsNavigation}
              className='border-2 border-brand-red-500 text-brand-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-red-500 hover:text-white transition-colors duration-200 flex items-center gap-2'
            >
              <Navigation className='w-4 h-4' />
              開始導航
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* 地圖容器 */}
      <div
        ref={mapRef}
        className='w-full h-full rounded-xl overflow-hidden border border-gray-200'
        style={{ minHeight: height }}
      />
      
      {/* 載入覆蓋層 */}
      {!mapLoaded && (
        <div className='absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-brand-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
            <p className='text-gray-600'>載入地圖中...</p>
          </div>
        </div>
      )}

      {/* 浮動操作按鈕 */}
      {mapLoaded && (
        <div className='absolute bottom-4 right-4 flex flex-col gap-2'>
          <button
            onClick={openGoogleMapsView}
            className='bg-white shadow-lg px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg_brand_gradient hover:text-white transition-all duration-200 flex items-center gap-1'
            title='在 Google Maps 中查看'
          >
            <ExternalLink className='w-4 h-4' />
            查看
          </button>
          <button
            onClick={openGoogleMapsNavigation}
            className='bg_brand_gradient text-white shadow-lg px-3 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-1'
            title='開始導航'
          >
            <Navigation className='w-4 h-4' />
            導航
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;