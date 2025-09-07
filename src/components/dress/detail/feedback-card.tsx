'use client';

import { LoadingItem } from '@/components/loading-item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getImages } from '@/lib/products-utils';
import { useLazyGetFeedbackQuery } from '@/services/apis';
import { IFeedback } from '@/services/types';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface FeedbackCardProps {
  feedbackId: string;
}

export const FeedbackCard = ({ feedbackId }: FeedbackCardProps) => {
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [trigger, { isLoading }] = useLazyGetFeedbackQuery();
  const [isError, setIsError] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      const { statusCode, item } = await trigger(feedbackId).unwrap();
      if (statusCode === 200) {
        setFeedback(item);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  }, [feedbackId, trigger, setFeedback, setIsError]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return isLoading ? (
    <LoadingItem />
  ) : isError ? null : (
    feedback && (
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={feedback.customer.username || '/placeholder.svg'} />
              <AvatarFallback>{feedback.customer.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">
                    {feedback.customer.username || 'Người dùng ẩn danh'}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Number(feedback.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-xs">
                  {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <p className="text-gray-700 mb-2">{feedback.content}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full mt-4 pl-14">
            {getImages(feedback.images).map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-muted"
              >
                <Image
                  alt={`${feedback.customer.username || 'Người dùng ẩn danh'} ${index + 1}`}
                  src={url || '/placeholder.svg'}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  );
};
