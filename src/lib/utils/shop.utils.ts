const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-blue-100 text-blue-700">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Đã xác minh
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">
        <Shield className="h-3 w-3 mr-1" />
        Chưa xác minh
      </Badge>
    );
  };

  const getStatusBadge = (status: ShopStatus) => {
    const statusConfig = {
      [ShopStatus.ACTIVE]: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-700",
      },
      [ShopStatus.PENDING]: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700",
      },
      [ShopStatus.SUSPENDED]: {
        label: "Tạm khóa",
        className: "bg-red-100 text-red-700",
      },
      [ShopStatus.INACTIVE]: {
        label: "Tạm ngưng",
        className: "bg-gray-100 text-gray-700",
      },
      [ShopStatus.BANNED]: {
        label: "Bị cấm",
        className: "bg-red-200 text-red-800",
      },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };