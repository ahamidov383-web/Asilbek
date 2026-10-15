import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAgency } from '../context/AgencyContext';
import { createTourSchema, CreateTourInput } from '../lib/validations';
import { Calendar, DollarSign, Users, MapPin, Save, ArrowLeft } from 'lucide-react';

export default function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tours, createTour, updateTour, loading } = useAgency();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!id;
  const existingTour = id ? tours.find(t => t.id === id) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTourInput>({
    resolver: zodResolver(createTourSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      totalSeats: 10,
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (isEdit && existingTour) {
      reset({
        title: existingTour.title,
        description: existingTour.description,
        price: existingTour.price,
        totalSeats: existingTour.totalSeats,
        startDate: existingTour.startDate.split('T')[0],
        endDate: existingTour.endDate.split('T')[0],
      });
    }
  }, [isEdit, existingTour, reset]);

  const onSubmit = async (data: CreateTourInput) => {
    setSubmitting(true);
    setError(null);

    try {
      let result;
      if (isEdit && id) {
        result = await updateTour(id, {
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        });
      } else {
        result = await createTour({
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        });
      }

      if (result.success) {
        navigate('/dashboard/tours');
      } else {
        setError(result.error || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isEdit && !existingTour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tur topilmadi</h2>
          <p className="text-gray-600 mb-6">Bu tur mavjud emas yoki sizda ruxsat yo'q</p>
          <button
            onClick={() => navigate('/dashboard/tours')}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Turlarga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/tours')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Turlarga qaytish
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Tur tahrirlash' : 'Yangi tur qo\'shish'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Tur ma\'lumotlarini yangilang' : 'Yangi sayohat paketini yarating'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Sarlavha *
            </label>
            <input
              type="text"
              {...register('title')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masalan: Silk Road Grand Tour"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tavsif *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Tur haqida batafsil ma'lumot..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price and Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Narx (USD) *
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1200"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Joylar soni *
              </label>
              <input
                type="number"
                {...register('totalSeats', { valueAsNumber: true })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalSeats ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="15"
              />
              {errors.totalSeats && (
                <p className="text-red-600 text-sm mt-1">{errors.totalSeats.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Boshlanish sanasi *
              </label>
              <input
                type="date"
                {...register('startDate')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Tugash sanasi *
              </label>
              <input
                type="date"
                {...register('endDate')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/tours')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Yangilash' : 'Saqlash'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
