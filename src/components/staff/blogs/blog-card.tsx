import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/order-util";
import { getCoverImage } from "@/lib/products-utils";
import { BlogStatus, IBlog } from "@/services/types";
import { Calendar, Eye, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  blog: IBlog;
  onUpdate?: () => void;
}

export const StatusBadge = ({ status }: { status: BlogStatus }) => {
  switch (status) {
    case BlogStatus.PUBLISHED:
      return <Badge variant={"success"}>Đã xuất bản</Badge>;
    case BlogStatus.UNPUBLISHED:
      return <Badge variant={"danger"}>Chưa xuất bản</Badge>;
    case BlogStatus.DRAFT:
      return <Badge variant={"info"}>Nháp</Badge>;
    default:
      return <Badge variant={"default"}>Không xác định</Badge>;
  }
};

export const VerifyBadge = ({ isVerified }: { isVerified: boolean }) => {
  return isVerified ? (
    <Badge className="bg-blue-500/10 border-blue-500 text-blue-500 flex items-center gap-2">
      <ShieldCheck className="size-2" />
      Đã xác minh
    </Badge>
  ) : (
    <Badge className="bg-rose-500/10 border-rose-500 text-rose-500 flex items-center gap-2">
      <Shield className="size-2" />
      Chưa xác minh
    </Badge>
  );
};

export const BlogCard = ({ blog, onUpdate }: BlogCardProps) => {
  const shop = blog.user.shop;
  return (
    <Card className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 overflow-hidden">
      <Image
        src={getCoverImage(blog.images)}
        alt={blog.title}
        width={500}
        height={300}
        className="col-span-1 aspect-[5/3] object-cover"
      />
      <div className="col-span-1 md:col-span-2 p-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-full flex items-center justify-between">
            <CardTitle>{blog.title}</CardTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={blog.status} />
              <VerifyBadge isVerified={blog.isVerified} />
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-rose-500" />
              {formatDateShort(blog.createdAt)}
            </div>
            {blog.deletedAt && <Badge variant="destructive">Đã xóa</Badge>}
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10 aspect-square rounded-full overflow-hidden">
              <AvatarImage src={shop?.logoUrl || undefined} alt={shop?.name} />
              <AvatarFallback> {shop?.name?.charAt(0) || "S"} </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-medium">{shop?.name}</div>
              <div className="text-sm text-muted-foreground">
                {shop?.address}
              </div>
            </div>
          </div>
          <Button
            className="flex items-center w-max gap-2"
            variant="outline"
            asChild
          >
            <Link href={`/staff/blogs/${blog.id}`}>
              <Eye className="size-4" />
              Xem chi tiết
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
