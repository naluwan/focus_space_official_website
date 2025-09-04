'use client';
import React, { useState, useEffect } from 'react';
import { Star, Users, Heart, TrendingUp } from 'lucide-react';
import TestimonialCard from './_components/TestimonialCard';
import TestimonialFilters from './_components/TestimonialFilters';

interface Testimonial {
  _id: string;
  memberName: string;
  age?: number;
  occupation?: string;
  content: string;
  rating: number;
  tags: string[];
  achievements: string[];
  trainingPeriod?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface FilterOptions {
  category: 'all' | 'weight-loss' | 'muscle-gain' | 'health' | 'fitness';
  rating: number;
  search: string;
}

const TestimonialsPage = () => {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]); // 用於統計的全部見證
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    rating: 0,
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 9;

  // 初始化時獲取所有見證用於統計
  useEffect(() => {
    const fetchAllTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        if (data.success && data.data) {
          setAllTestimonials(data.data);
        }
      } catch (err) {
        console.error('Error fetching all testimonials:', err);
      }
    };

    fetchAllTestimonials();
  }, []);

  // 獲取篩選後的見證資料
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // 構建 API URL 參數
        const params = new URLSearchParams();
        if (filters.category !== 'all') {
          params.append('category', filters.category);
        }
        if (filters.rating > 0) {
          params.append('rating', filters.rating.toString());
        }
        if (filters.search.trim()) {
          params.append('search', filters.search.trim());
        }

        const response = await fetch(`/api/testimonials${params.toString() ? `?${params.toString()}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        
        if (data.success && data.data) {
          setFilteredTestimonials(data.data); // 直接使用 API 篩選的結果
        } else {
          setFilteredTestimonials([]);
          setError('No testimonials found');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [filters]); // 當篩選條件變化時重新獲取資料

  // 智能分類函數
  const categorizeTestimonial = (testimonial: Testimonial): string => {
    const tags = testimonial.tags ? testimonial.tags.map(tag => tag.toLowerCase().trim()) : [];
    const content = testimonial.content ? testimonial.content.toLowerCase() : '';
    const achievements = testimonial.achievements ? testimonial.achievements.map(a => a.toLowerCase()).join(' ') : '';
    
    // 檢查所有文字內容
    const allText = [...tags, content, achievements].join(' ');
    
    // 減重相關關鍵字
    const weightLossKeywords = ['減重', '減脂', '瘦身', '減肥', '體重', '脂肪', '瘦'];
    if (weightLossKeywords.some(keyword => allText.includes(keyword))) {
      return 'weight-loss';
    }
    
    // 增肌相關關鍵字
    const muscleGainKeywords = ['增肌', '塑形', '肌肉', '線條', '體態', '身材'];
    if (muscleGainKeywords.some(keyword => allText.includes(keyword))) {
      return 'muscle-gain';
    }
    
    // 健康相關關鍵字
    const healthKeywords = ['健康', '復健', '疼痛', '改善', '治療', '康復'];
    if (healthKeywords.some(keyword => allText.includes(keyword))) {
      return 'health';
    }
    
    // 預設為體能提升
    return 'fitness';
  };

  // 篩選邏輯已移到 API 端處理，這裡只需要重設頁面
  useEffect(() => {
    setCurrentPage(1); // 重設到第一頁
  }, [filteredTestimonials]);

  // 分頁邏輯
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 統計數據
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      number: allTestimonials.length,
      label: '成功會員',
    },
    {
      icon: <Star className="w-6 h-6" />,
      number: allTestimonials.length > 0 ? (allTestimonials.reduce((sum, t) => sum + t.rating, 0) / allTestimonials.length).toFixed(1) : '0',
      label: '平均評分',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      number: allTestimonials.filter(t => categorizeTestimonial(t) === 'weight-loss').length,
      label: '減重成功',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      number: allTestimonials.filter(t => categorizeTestimonial(t) === 'muscle-gain').length,
      label: '增肌塑形',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-container mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">暫無見證資料</h2>
          <p className="text-gray-600">目前沒有可顯示的會員見證，請稍後再來查看！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero 區域 */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text_brand_gradient text-4xl md:text-6xl font-bold font-bebas_neue mb-6">
              會員見證
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              真實的訓練成果，見證每一個蛻變的故事
            </p>
            
            {/* 統計數據 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg_brand_gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text_brand_gradient mb-2 font-bebas_neue">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 篩選器和內容區域 */}
      <div className="max-container mx-auto px-6 py-16">
        <TestimonialFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={filteredTestimonials.length}
        />

        {/* 見證卡片網格 */}
        {currentTestimonials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 auto-rows-fr">
              {currentTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  category={categorizeTestimonial(testimonial)}
                  index={index}
                />
              ))}
            </div>

            {/* 分頁 */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* 頁面資訊 - 在小螢幕上顯示 */}
                <div className="text-sm text-gray-600 sm:hidden">
                  第 {currentPage} 頁，共 {totalPages} 頁
                </div>
                
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sm:hidden">←</span>
                    <span className="hidden sm:inline">上一頁</span>
                  </button>
                  
                  {/* 顯示頁碼 - 在小螢幕上只顯示部分 */}
                  <div className="flex gap-2">
                    {totalPages <= 5 ? (
                      // 頁數少時顯示全部
                      [...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg font-semibold transition-colors ${
                            currentPage === i + 1
                              ? 'bg_brand_gradient text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))
                    ) : (
                      // 頁數多時顯示簡化版本
                      <>
                        {currentPage > 2 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              className="px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              1
                            </button>
                            {currentPage > 3 && <span className="px-2 py-2 text-gray-400">...</span>}
                          </>
                        )}
                        
                        {/* 當前頁附近的頁碼 */}
                        {[currentPage - 1, currentPage, currentPage + 1]
                          .filter(page => page >= 1 && page <= totalPages)
                          .map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg font-semibold transition-colors ${
                                currentPage === page
                                  ? 'bg_brand_gradient text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        
                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && <span className="px-2 py-2 text-gray-400">...</span>}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sm:hidden">→</span>
                    <span className="hidden sm:inline">下一頁</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">沒有找到符合條件的見證</h3>
            <p className="text-gray-600">嘗試調整篩選條件或搜尋關鍵字</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;