'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, Edit, Trash2, Eye, Star } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Testimonial {
  _id: string
  memberName: string
  age?: number
  occupation?: string
  content: string
  rating: number
  imageUrl?: string
  beforeImageUrl?: string
  afterImageUrl?: string
  isPublished: boolean
  tags: string[]
  trainingPeriod?: string
  achievements: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  sortOrder: number
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

const TestimonialsContent = () => {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);

      const response = await fetch(`/api/admin/testimonials?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTestimonials(data.testimonials);
        setPagination(data.pagination);
      } else {
        console.error('獲取見證列表失敗:', data.error);
      }
    } catch (error) {
      console.error('獲取見證列表失敗:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, publishedFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('見證刪除成功！');
        await fetchTestimonials();
      } else {
        const data = await response.json();
        console.error('刪除見證失敗:', data.error);
        toast.error('刪除見證失敗：' + data.error);
      }
    } catch (error) {
      console.error('刪除見證失敗:', error);
      toast.error('刪除見證失敗，請稍後再試');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus })
      });

      if (response.ok) {
        toast.success(currentStatus ? '取消發布成功！' : '發布成功！');
        await fetchTestimonials();
      } else {
        const data = await response.json();
        console.error('更新發布狀態失敗:', data.error);
        toast.error('更新發布狀態失敗：' + data.error);
      }
    } catch (error) {
      console.error('更新發布狀態失敗:', error);
      toast.error('更新發布狀態失敗，請稍後再試');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setPublishedFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.min(100, Math.max(0, (rating - i) * 100));
      
      return (
        <div key={i} className="relative h-4 w-4">
          <Star className="h-4 w-4 text-gray-300 absolute" />
          <div className="absolute overflow-hidden" style={{ width: `${fillPercentage}%` }}>
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <>
      {/* 搜尋和篩選 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索會員姓名、內容、職業或標籤..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
            />
          </div>
          
          <select
            value={publishedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          >
            <option value="all">所有狀態</option>
            <option value="true">已發布</option>
            <option value="false">未發布</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
          >
            <option value="createdAt-desc">建立時間 ↓</option>
            <option value="createdAt-asc">建立時間 ↑</option>
            <option value="sortOrder-asc">顯示順序 ↑</option>
            <option value="sortOrder-desc">顯示順序 ↓</option>
            <option value="rating-desc">評分 ↓</option>
            <option value="rating-asc">評分 ↑</option>
          </select>
        </div>
      </div>

      {/* 見證列表 */}
      <div className="bg-white rounded-lg shadow">
        {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">暫無見證資料</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('memberName')}
                  >
                    會員資訊
                    {sortBy === 'memberName' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    內容預覽
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('rating')}
                  >
                    評分
                    {sortBy === 'rating' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    標籤
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    狀態
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    建立時間
                    {sortBy === 'createdAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {testimonial.imageUrl && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={testimonial.imageUrl} 
                              alt={testimonial.memberName}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div className={testimonial.imageUrl ? 'ml-4' : ''}>
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.memberName}
                          </div>
                          {testimonial.age && (
                            <div className="text-sm text-gray-500">
                              {testimonial.age}歲
                            </div>
                          )}
                          {testimonial.occupation && (
                            <div className="text-sm text-gray-500">
                              {testimonial.occupation}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {truncateText(testimonial.content, 60)}
                      </div>
                      {testimonial.trainingPeriod && (
                        <div className="text-xs text-gray-500 mt-1">
                          訓練期間: {testimonial.trainingPeriod}
                        </div>
                      )}
                      {testimonial.achievements && testimonial.achievements.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          成就: {testimonial.achievements.slice(0, 2).join(', ')}
                          {testimonial.achievements.length > 2 && '...'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(testimonial.rating)}
                        <span className="ml-2 text-sm text-gray-900">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {testimonial.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {testimonial.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{testimonial.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(testimonial._id, testimonial.isPublished)}
                        className={testimonial.isPublished 
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }
                      >
                        {testimonial.isPublished ? '已發布' : '未發布'}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(testimonial.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/testimonials/${testimonial._id}`)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/testimonials/${testimonial._id}/edit`)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">確認刪除見證</AlertDialogTitle>
                              <AlertDialogDescription>
                                您確定要刪除 <strong>{testimonial.memberName}</strong> 的見證嗎？
                                此操作無法撤銷。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-gray-700 bg-gray-100 hover:bg-gray-200">取消</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(testimonial._id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}

      {/* 分頁控制 */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              顯示第 {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)} 筆，
              共 {pagination.total} 筆見證
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-gray-700"
              >
                上一頁
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum: number;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? '' : 'text-gray-700'}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={currentPage === pagination.pages}
                className="text-gray-700"
              >
                下一頁
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default TestimonialsContent;