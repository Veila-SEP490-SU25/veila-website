import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth.provider";

export const UserCard = () => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={currentUser.avatarUrl || "/placeholder-user.jpg"}
            />
            <AvatarFallback className="bg-rose-100 text-rose-600">
              {currentUser.firstName.charAt(0) +
                currentUser.lastName.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">
              {currentUser.firstName} {currentUser.middleName}{" "}
              {currentUser.lastName}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={"/placeholder-user.jpg"} />
            <AvatarFallback className="bg-rose-100 text-rose-600">
              {"U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">User</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
