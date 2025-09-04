'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  DollarSign,
  User,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUploadThing } from '@/lib/uploadthing';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker-compact';

// 修復時區問題的日期格式化函數
const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface AdminSession {
  user?: {
    name?: string | null;
    email?: string | null;
    id?: string;
  };
  expires: string;
}

interface NewCourseContentProps {
  session: AdminSession;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

const NewCourseContent = ({ session }: NewCourseContentProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as 'personal' | 'group' | 'special',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 60,
    price: 0,
    maxParticipants: 1,
    instructor: '',
    imageUrl: '',
    features: [''],
    requirements: '',
    startDate: '',
    endDate: '',
    weekdays: [] as number[],
    timeSlots: [{ startTime: '', endTime: '' }] as TimeSlot[],
    allowLateEnrollment: false,
    isActive: true,
    displayOrder: 0,
  });

  const { startUpload, isUploading } = useUploadThing('courseImage', {
    onClientUploadComplete: (res) => {
      console.log('Upload completed:', res);
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, image: `圖片上傳失敗: ${error.message}` }));
    },
  });

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: '主控台',
      href: '/admin/dashboard',
      active: false,
    },
    {
      icon: Calendar,
      label: '預約管理',
      href: '/admin/bookings',
      active: false,
    },
    {
      icon: BookOpen,
      label: '課程管理',
      href: '/admin/courses',
      active: true,
    },
    {
      icon: Users,
      label: '會員見證',
      href: '/admin/testimonials', 
      active: false,
    },
    {
      icon: BarChart3,
      label: '分析報告',
      href: '/admin/analytics',
      active: false,
    },
  ];

  const weekdayOptions = [
    { value: 1, label: '星期一' },
    { value: 2, label: '星期二' },
    { value: 3, label: '星期三' },
    { value: 4, label: '星期四' },
    { value: 5, label: '星期五' },
    { value: 6, label: '星期六' },
    { value: 0, label: '星期日' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleWeekdayChange = (weekday: number) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(weekday)
        ? prev.weekdays.filter(day => day !== weekday)
        : [...prev.weekdays, weekday]
    }));
  };

  const handleTimeSlotChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '', endTime: '' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = '課程名稱為必填';
    if (!formData.description.trim()) newErrors.description = '課程描述為必填';
    if (formData.duration <= 0) newErrors.duration = '課程時長必須大於0';
    if (formData.price < 0) newErrors.price = '價格不能為負數';
    if (formData.category === 'group' && formData.maxParticipants <= 1) {
      newErrors.maxParticipants = '團體課程最大參與人數必須大於1';
    }
    if (!formData.startDate) newErrors.startDate = '開始日期為必填';
    if (!formData.endDate) newErrors.endDate = '結束日期為必填';
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = '結束日期必須晚於開始日期';
    }
    if (formData.weekdays.length === 0) newErrors.weekdays = '至少需要選擇一個上課日';
    
    const validTimeSlots = formData.timeSlots.filter(slot => slot.startTime && slot.endTime);
    if (validTimeSlots.length === 0) {
      newErrors.timeSlots = '至少需要設定一個完整的上課時間';
    }

    formData.timeSlots.forEach((slot, index) => {
      if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
        newErrors[`timeSlot_${index}`] = '結束時間必須晚於開始時間';
      }
    });

    const validFeatures = formData.features.filter(feature => feature.trim());
    if (validFeatures.length === 0) {
      newErrors.features = '至少需要填寫一個課程特色';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      let imageUrl = formData.imageUrl; // Use existing imageUrl if no new image selected
      
      // Upload image if user selected one
      if (selectedImage) {
        const uploadResult = await startUpload([selectedImage]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url;
        } else {
          throw new Error('圖片上傳失敗');
        }
      }

      const courseData = {
        ...formData,
        imageUrl,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        timeSlots: formData.timeSlots.filter(slot => slot.startTime && slot.endTime),
        features: formData.features.filter(feature => feature.trim()),
        maxParticipants: formData.category === 'personal' ? 1 : formData.maxParticipants,
      };

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clean up preview URL
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        router.push('/admin/courses');
      } else {
        if (result.conflicts && result.conflicts.length > 0) {
          setErrors({ submit: `時間衝突：與現有課程「${result.conflicts.map((c: { title: string }) => c.title).join('、')}」時間重疊` });
        } else {
          setErrors({ submit: result.message || '新增課程失敗，請稍後再試' });
        }
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors({ submit: error instanceof Error ? error.message : '新增課程失敗，請稍後再試' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen bg-gray-900'>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className='flex items-center justify-between h-16 px-6 bg-gray-900'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>FS</span>
            </div>
            <span className='text-white font-semibold text-lg'>Focus Space</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-gray-400 hover:text-white'
          >
            <X size={24} />
          </button>
        </div>

        <nav className='mt-8'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? 'text-white bg-gray-700 border-r-2 border-red-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon size={20} className='mr-3' />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-0 w-full p-6 bg-gray-900'>
          <div className='flex items-center space-x-3 mb-4'>
            <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-medium'>
                {session.user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className='text-white text-sm font-medium'>{session.user?.name || '管理員'}</p>
              <p className='text-gray-400 text-xs'>管理員</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className='flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors'
          >
            <LogOut size={16} className='mr-3' />
            登出
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-gray-900 bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden text-gray-600 hover:text-gray-900'
              >
                <Menu size={24} />
              </button>
              <Link
                href='/admin/courses'
                className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'
              >
                <ArrowLeft size={20} />
                <span>返回課程列表</span>
              </Link>
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>新增課程</h1>
          </div>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50'>
          <div className='container mx-auto px-6 py-8'>
            <div className='max-w-4xl mx-auto'>
              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* 基本資訊 */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-6 flex items-center'>
                    <FileText className='mr-2' size={20} />
                    基本資訊
                  </h3>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='md:col-span-2'>
                      <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
                        課程名稱 *
                      </label>
                      <input
                        type='text'
                        id='title'
                        name='title'
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='輸入課程名稱'
                      />
                      {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title}</p>}
                    </div>

                    <div className='md:col-span-2'>
                      <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
                        課程描述 *
                      </label>
                      <textarea
                        id='description'
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='輸入課程描述'
                      />
                      {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description}</p>}
                    </div>

                    <div>
                      <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2'>
                        課程分類
                      </label>
                      <select
                        id='category'
                        name='category'
                        value={formData.category}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                      >
                        <option value='personal'>個人課程</option>
                        <option value='group'>團體課程</option>
                        <option value='special'>特殊課程</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor='difficulty' className='block text-sm font-medium text-gray-700 mb-2'>
                        課程難度
                      </label>
                      <select
                        id='difficulty'
                        name='difficulty'
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                      >
                        <option value='beginner'>初級</option>
                        <option value='intermediate'>中級</option>
                        <option value='advanced'>高級</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor='duration' className='block text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <Clock className='mr-1' size={16} />
                        課程時長 (分鐘) *
                      </label>
                      <input
                        type='number'
                        id='duration'
                        name='duration'
                        value={formData.duration}
                        onChange={handleInputChange}
                        min='1'
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                          errors.duration ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.duration && <p className='mt-1 text-sm text-red-600'>{errors.duration}</p>}
                    </div>

                    <div>
                      <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <DollarSign className='mr-1' size={16} />
                        價格 (NT$) *
                      </label>
                      <input
                        type='number'
                        id='price'
                        name='price'
                        value={formData.price}
                        onChange={handleInputChange}
                        min='0'
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.price && <p className='mt-1 text-sm text-red-600'>{errors.price}</p>}
                    </div>

                    {formData.category === 'group' && (
                      <div>
                        <label htmlFor='maxParticipants' className='block text-sm font-medium text-gray-700 mb-2 flex items-center'>
                          <Users className='mr-1' size={16} />
                          最大參與人數
                        </label>
                        <input
                          type='number'
                          id='maxParticipants'
                          name='maxParticipants'
                          value={formData.maxParticipants}
                          onChange={handleInputChange}
                          min='2'
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 ${
                            errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.maxParticipants && <p className='mt-1 text-sm text-red-600'>{errors.maxParticipants}</p>}
                      </div>
                    )}

                    <div>
                      <label htmlFor='instructor' className='block text-sm font-medium text-gray-700 mb-2 flex items-center'>
                        <User className='mr-1' size={16} />
                        教練
                      </label>
                      <input
                        type='text'
                        id='instructor'
                        name='instructor'
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                        placeholder='輸入教練名稱'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        課程圖片
                      </label>
                      {(imagePreview || formData.imageUrl) ? (
                        <div className='space-y-3'>
                          <div className='relative'>
                            <Image 
                              src={imagePreview || formData.imageUrl} 
                              alt='課程圖片預覽'
                              width={400}
                              height={192}
                              className='w-full h-48 object-cover rounded-lg border border-gray-300'
                            />
                            <button
                              type='button'
                              onClick={() => {
                                if (imagePreview) {
                                  URL.revokeObjectURL(imagePreview);
                                  setImagePreview('');
                                  setSelectedImage(null);
                                } else {
                                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                                }
                              }}
                              className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors'
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {!imagePreview && formData.imageUrl && (
                            <div className='flex items-center space-x-2'>
                              <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageSelect}
                                className='hidden'
                                id='new-image-input'
                              />
                              <label
                                htmlFor='new-image-input'
                                className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm'
                              >
                                更換圖片
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6'>
                          <div className='text-center'>
                            <input
                              type='file'
                              accept='image/*'
                              onChange={handleImageSelect}
                              className='hidden'
                              id='image-input'
                            />
                            <label
                              htmlFor='image-input'
                              className='bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow cursor-pointer inline-block'
                            >
                              選擇課程圖片
                            </label>
                            <p className='text-gray-600 text-sm mt-2'>支援 JPG、PNG 格式，最大 4MB</p>
                          </div>
                        </div>
                      )}
                      {errors.image && <p className='mt-1 text-sm text-red-600'>{errors.image}</p>}
                    </div>

                    <div>
                      <label htmlFor='displayOrder' className='block text-sm font-medium text-gray-700 mb-2'>
                        顯示順序
                      </label>
                      <input
                        type='number'
                        id='displayOrder'
                        name='displayOrder'
                        value={formData.displayOrder}
                        onChange={handleInputChange}
                        min='0'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                      />
                    </div>
                  </div>
                </div>

                {/* 時間設定 */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-6 flex items-center'>
                    <Calendar className='mr-2' size={20} />
                    時間設定
                  </h3>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        開始日期 *
                      </label>
                      <DatePicker
                        date={formData.startDate ? new Date(formData.startDate) : undefined}
                        onDateChange={(date) => {
                          setFormData(prev => ({
                            ...prev,
                            startDate: date ? formatDateToLocalString(date) : ''
                          }));
                          if (errors.startDate) {
                            setErrors(prev => ({ ...prev, startDate: '' }));
                          }
                        }}
                        placeholder="選擇開始日期"
                        className={errors.startDate ? 'border-red-500' : ''}
                      />
                      {errors.startDate && <p className='mt-1 text-sm text-red-600'>{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        結束日期 *
                      </label>
                      <DatePicker
                        date={formData.endDate ? new Date(formData.endDate) : undefined}
                        onDateChange={(date) => {
                          setFormData(prev => ({
                            ...prev,
                            endDate: date ? formatDateToLocalString(date) : ''
                          }));
                          if (errors.endDate) {
                            setErrors(prev => ({ ...prev, endDate: '' }));
                          }
                        }}
                        placeholder="選擇結束日期"
                        className={errors.endDate ? 'border-red-500' : ''}
                      />
                      {errors.endDate && <p className='mt-1 text-sm text-red-600'>{errors.endDate}</p>}
                    </div>
                  </div>

                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      上課星期 *
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {weekdayOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                            formData.weekdays.includes(option.value)
                              ? 'bg-red-50 border-red-500 text-red-700'
                              : 'border-gray-300 hover:bg-gray-50 text-gray-900'
                          }`}
                        >
                          <input
                            type='checkbox'
                            checked={formData.weekdays.includes(option.value)}
                            onChange={() => handleWeekdayChange(option.value)}
                            className='sr-only'
                          />
                          <span className='text-sm font-medium'>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.weekdays && <p className='mt-1 text-sm text-red-600'>{errors.weekdays}</p>}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>
                      上課時間 *
                    </label>
                    {formData.timeSlots.map((timeSlot, index) => (
                      <div key={index} className='flex items-center space-x-2 mb-3'>
                        <div className='flex-1'>
                          <TimePicker
                            time={timeSlot.startTime}
                            onTimeChange={(time) => handleTimeSlotChange(index, 'startTime', time)}
                            placeholder="開始時間"
                            className={errors[`timeSlot_${index}`] ? 'border-red-500' : ''}
                          />
                        </div>
                        <span className='text-gray-500 text-sm'>到</span>
                        <div className='flex-1'>
                          <TimePicker
                            time={timeSlot.endTime}
                            onTimeChange={(time) => handleTimeSlotChange(index, 'endTime', time)}
                            placeholder="結束時間"
                            className={errors[`timeSlot_${index}`] ? 'border-red-500' : ''}
                          />
                        </div>
                        {formData.timeSlots.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeTimeSlot(index)}
                            className='p-2 text-red-600 hover:text-red-800'
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type='button'
                      onClick={addTimeSlot}
                      className='flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm'
                    >
                      <Plus size={16} />
                      <span>新增時間段</span>
                    </button>
                    
                    {errors.timeSlots && <p className='mt-1 text-sm text-red-600'>{errors.timeSlots}</p>}
                    {Object.keys(errors).some(key => key.startsWith('timeSlot_')) && (
                      <p className='mt-1 text-sm text-red-600'>
                        {Object.entries(errors).find(([key]) => key.startsWith('timeSlot_'))?.[1]}
                      </p>
                    )}
                  </div>
                </div>

                {/* 課程特色 */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-6'>
                    課程特色 *
                  </h3>
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className='flex items-center space-x-2 mb-3'>
                      <div className='flex-1'>
                        <input
                          type='text'
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                          placeholder='輸入課程特色'
                        />
                      </div>
                      {formData.features.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeFeature(index)}
                          className='p-2 text-red-600 hover:text-red-800'
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type='button'
                    onClick={addFeature}
                    className='flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm'
                  >
                    <Plus size={16} />
                    <span>新增特色</span>
                  </button>
                  
                  {errors.features && <p className='mt-1 text-sm text-red-600'>{errors.features}</p>}
                </div>

                {/* 其他資訊 */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-6'>
                    其他資訊
                  </h3>
                  
                  <div className='mb-6'>
                    <label htmlFor='requirements' className='block text-sm font-medium text-gray-700 mb-2'>
                      上課要求/注意事項
                    </label>
                    <textarea
                      id='requirements'
                      name='requirements'
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900'
                      placeholder='輸入上課要求或注意事項'
                    />
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='isActive'
                        name='isActive'
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                      />
                      <label htmlFor='isActive' className='ml-2 block text-sm text-gray-900'>
                        立即啟用此課程
                      </label>
                    </div>
                    
                    {/* 插班設定 - 只對團體課程顯示 */}
                    {formData.category === 'group' && (
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          id='allowLateEnrollment'
                          name='allowLateEnrollment'
                          checked={formData.allowLateEnrollment}
                          onChange={(e) => setFormData(prev => ({ ...prev, allowLateEnrollment: e.target.checked }))}
                          className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded'
                        />
                        <label htmlFor='allowLateEnrollment' className='ml-2 block text-sm text-gray-900'>
                          允許課程開始後插班
                        </label>
                        <span className='ml-2 text-xs text-gray-500'>
                          (勾選後，即使課程已開始，學員仍可預約加入)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 錯誤訊息 */}
                {errors.submit && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='flex items-center'>
                      <AlertCircle className='h-5 w-5 text-red-400 mr-2' />
                      <p className='text-sm text-red-700'>{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* 提交按鈕 */}
                <div className='flex items-center justify-end space-x-4'>
                  <Link
                    href='/admin/courses'
                    className='px-6 py-2 border-2 border-gray-400 rounded-lg text-gray-100 bg-gray-700 hover:bg-gray-600 hover:border-gray-500 transition-colors font-medium'
                  >
                    取消
                  </Link>
                  <button
                    type='submit'
                    disabled={loading || isUploading}
                    className='flex items-center space-x-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading || isUploading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        <span>{isUploading ? '上傳圖片中...' : '建立中...'}</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>建立課程</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewCourseContent;