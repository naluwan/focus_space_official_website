'use client';
import React from 'react';
import { Filter, Search, Star, Users } from 'lucide-react';

interface FilterOptions {
  category: 'all' | 'weight-loss' | 'muscle-gain' | 'health' | 'fitness';
  rating: number;
  search: string;
}

interface TestimonialFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  totalCount: number;
}

const TestimonialFilters: React.FC<TestimonialFiltersProps> = ({
  filters,
  onFilterChange,
  totalCount,
}) => {
  const categories = [
    { value: 'all', label: '全部分類', count: totalCount },
    { value: 'weight-loss', label: '減重成功', icon: '📉' },
    { value: 'muscle-gain', label: '增肌塑形', icon: '💪' },
    { value: 'health', label: '健康改善', icon: '❤️' },
    { value: 'fitness', label: '體能提升', icon: '🎯' },
  ];

  const ratings = [
    { value: 0, label: '全部評分' },
    { value: 4, label: '4星以上' },
    { value: 4.5, label: '4.5星以上' },
    { value: 5, label: '5星' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">篩選見證</h3>
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>共 {totalCount} 則見證</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* 搜尋欄 */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋會員姓名、職業或見證內容..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 分類篩選 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              見證分類
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onFilterChange({ category: category.value as FilterOptions['category'] })}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all text-sm font-medium
                    ${filters.category === category.value
                      ? 'bg_brand_gradient text-white border-0 shadow-lg'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-brand-red-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {category.icon && <span>{category.icon}</span>}
                    <span>{category.label}</span>
                  </div>
                  {category.count !== undefined && (
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${filters.category === category.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 評分篩選 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              評分篩選
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => onFilterChange({ rating: rating.value })}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all text-sm font-medium
                    ${filters.rating === rating.value
                      ? 'bg_brand_gradient text-white border-0 shadow-lg'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-brand-red-300 hover:shadow-md'
                    }
                  `}
                >
                  <span>{rating.label}</span>
                  {rating.value > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${filters.rating === rating.value ? 'text-white' : 'text-yellow-400'}`} />
                      <span>{rating.value}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 清除篩選 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              快速操作
            </label>
            <button
              onClick={() => onFilterChange({ category: 'all', rating: 0, search: '' })}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-red-300 hover:text-brand-red-600 transition-all text-sm font-medium"
            >
              清除所有篩選
            </button>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              已套用 {[
                filters.category !== 'all' ? '分類' : null,
                filters.rating > 0 ? '評分' : null,
                filters.search.trim() ? '搜尋' : null
              ].filter(Boolean).length} 個篩選條件
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialFilters;