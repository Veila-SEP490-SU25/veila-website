import { FavoriteDressesTab } from '@/components/profile/favourites/favorite-dressses';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ProfileFavoriteCard = () => {
  return (
    <Card>
      <Tabs defaultValue="dresses">
        <CardHeader>
          <TabsList className="w-full grid grid-cols-2 gap-4">
            <TabsTrigger value="dresses">Váy yêu thích</TabsTrigger>
            <TabsTrigger value="shops">Cửa hàng yêu thích</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="dresses">
            <FavoriteDressesTab />
          </TabsContent>
          <TabsContent value="shops"></TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
