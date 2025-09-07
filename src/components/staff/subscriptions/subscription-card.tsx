import { DeleteSubscriptionDialog } from '@/components/staff/subscriptions/delete-subscription-dialog';
import { RestoreSubscriptionDialog } from '@/components/staff/subscriptions/restore-subscription-dialog';
import { UpdateSubscriptionDialog } from '@/components/staff/subscriptions/update-subscription-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { formatPrice, getCoverImage } from '@/lib/products-utils';
import { ISubscription } from '@/services/types';
import { ArchiveRestore, Banknote, Clock, Edit3, Trash } from 'lucide-react';
import Image from 'next/image';

interface SubscriptionCardProps {
  subscription: ISubscription;
  onUpdate?: () => void;
}

export const SubscriptionCard = ({ subscription, onUpdate }: SubscriptionCardProps) => {
  return (
    <Card className="w-full h-full bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-0 pt-1 hover:shadow-lg overflow-hidden">
      <div className="bg-white p-2 rounded-t-lg space-y-2 w-full h-full">
        <div className="space-y-2">
          <div className="relative w-full">
            <Image
              src={getCoverImage(subscription.images)}
              alt={subscription.name}
              width={500}
              height={300}
              className="rounded-lg aspect-[4/3] object-cover"
            />
            {subscription.deletedAt && (
              <Badge className="border-rose-500 bg-rose-500/10 text-rose-500 flex items-center gap-1 absolute top-4 right-4">
                <Trash className="size-2" /> Đã xóa
              </Badge>
            )}
          </div>

          <CardTitle className="mt-4">{subscription.name}</CardTitle>
          <CardDescription className="line-clamp-3">{subscription.description}</CardDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-rose-500" />
              <span className="text-sm text-muted-foreground">{subscription.duration} ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-rose-500" />
              <span className="text-sm text-muted-foreground">
                {formatPrice(subscription.amount)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <UpdateSubscriptionDialog subscription={subscription} onSuccess={onUpdate}>
              <Button className="w-full flex items-center gap-2" variant="outline">
                <Edit3 className="size-4" />
                Chỉnh sửa
              </Button>
            </UpdateSubscriptionDialog>
            {!subscription.deletedAt ? (
              <DeleteSubscriptionDialog subscription={subscription} onSuccess={onUpdate}>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                >
                  <Trash className="size-4" />
                  Xóa
                </Button>
              </DeleteSubscriptionDialog>
            ) : (
              <RestoreSubscriptionDialog subscription={subscription} onSuccess={onUpdate}>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                >
                  <ArchiveRestore className="size-4" />
                  Khôi phục
                </Button>
              </RestoreSubscriptionDialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
