import { ShopBlogsTabs } from '@/components/shops/my/blogs/shop-blogs-tabs';

export default function MyShopBlogsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý blog</h1>
        <p className="text-muted-foreground">Tạo và quản lý các bài viết blog của cửa hàng</p>
      </div>
      <ShopBlogsTabs />
    </div>
  );
}
