"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useLazyGetDistrictsQuery,
  useLazyGetProvincesQuery,
  useLazyGetWardsQuery,
} from "@/services/apis";
import type { IDistrict, IProvince, IWard } from "@/services/types";
import { useEffect, useState, useRef } from "react";

interface LocationInputProps {
  location: string;
  setLocation: (location: string) => void;
}

export const LocationInput = ({
  location,
  setLocation,
}: LocationInputProps) => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [detailAddress, setDetailAddress] = useState<string>("");

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const isParsingRef = useRef(false);

  const [fetchProvinces] = useLazyGetProvincesQuery();
  const [fetchDistricts] = useLazyGetDistrictsQuery();
  const [fetchWards] = useLazyGetWardsQuery();

  // Parse existing location when component mounts (chỉ chạy 1 lần)
  useEffect(() => {
    if (isParsingRef.current || !location || provinces.length === 0) return;

    isParsingRef.current = true;

    try {
      // Tìm province từ location hiện tại
      const province = provinces.find((p) => location.includes(p.name));
      if (province) {
        setSelectedProvinceId(province.id);
      }
    } finally {
      // Đánh dấu đã initialized sau khi parse xong
      setIsInitialized(true);
    }
  }, [location, provinces]);

  // Parse district khi province được chọn
  useEffect(() => {
    if (!selectedProvinceId || districts.length === 0) return;

    const district = districts.find((d) => location?.includes(d.name));
    if (district) {
      setSelectedDistrictId(district.id);
    }
  }, [selectedProvinceId, districts, location]);

  // Parse ward khi district được chọn
  useEffect(() => {
    if (!selectedDistrictId || wards.length === 0) return;

    const ward = wards.find((w) => location?.includes(w.name));
    if (ward) {
      setSelectedWardId(ward.id);
    }
  }, [selectedDistrictId, wards, location]);

  // Parse detail address khi tất cả đã được set
  useEffect(() => {
    if (
      !selectedProvinceId ||
      !selectedDistrictId ||
      !selectedWardId ||
      isParsingRef.current
    )
      return;

    const province =
      provinces.find((p) => p.id === selectedProvinceId)?.name || "";
    const district =
      districts.find((d) => d.id === selectedDistrictId)?.name || "";
    const ward = wards.find((w) => w.id === selectedWardId)?.name || "";

    if (province && district && ward && location) {
      let detailAddr = location;

      if (province) {
        detailAddr = detailAddr
          .replace(
            new RegExp(province.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
            ""
          )
          .trim();
      }
      if (district) {
        detailAddr = detailAddr
          .replace(
            new RegExp(district.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
            ""
          )
          .trim();
      }
      if (ward) {
        detailAddr = detailAddr
          .replace(
            new RegExp(ward.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
            ""
          )
          .trim();
      }

      // Loại bỏ dấu phẩy thừa và khoảng trắng
      detailAddr = detailAddr.replace(/^[,,\s]+/, "").replace(/[,,\s]+$/, "");
      detailAddr = detailAddr.replace(/,\s*,/g, ",").trim();

      // Chỉ set nếu detail address có ý nghĩa và không phải là chuỗi rỗng hoặc chỉ có dấu phẩy
      if (
        detailAddr &&
        detailAddr.length > 2 &&
        detailAddr !== detailAddress &&
        !/^[,,\s]+$/.test(detailAddr)
      ) {
        setDetailAddress(detailAddr);
      }
    }
  }, [
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    provinces,
    districts,
    wards,
    location,
    detailAddress,
  ]);

  const handleSelectProvinceId = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId("");
    setSelectedWardId("");
    setDistricts([]);
    setWards([]);
    setDetailAddress(""); // Reset detail address
    // Reset parsing flag khi user chọn thủ công
    isParsingRef.current = false;
  };

  const handleSelectDistrictId = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setSelectedWardId("");
    setWards([]);
    setDetailAddress(""); // Reset detail address
    // Reset parsing flag khi user chọn thủ công
    isParsingRef.current = false;
  };

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const { data } = await fetchProvinces({
          page: 0,
          size: 100,
          query: "",
        }).unwrap();
        setProvinces(data);

        // Nếu không có location, set initialized ngay
        if (!location) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to load provinces:", error);
        // Vẫn set initialized để tránh infinite loop
        setIsInitialized(true);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, [fetchProvinces, location]);

  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedProvinceId) return;

      setIsLoadingDistricts(true);
      try {
        const { data } = await fetchDistricts({
          page: 0,
          size: 100,
          query: "",
          id: selectedProvinceId,
        }).unwrap();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [selectedProvinceId, fetchDistricts]);

  const [isLoadingWards, setIsLoadingWards] = useState(false);

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDistrictId) return;

      setIsLoadingWards(true);
      try {
        const { data } = await fetchWards({
          page: 0,
          size: 100,
          query: "",
          id: selectedDistrictId,
        }).unwrap();
        setWards(data);
      } catch (error) {
        console.error("Failed to load wards:", error);
      } finally {
        setIsLoadingWards(false);
      }
    };
    loadWards();
  }, [selectedDistrictId, fetchWards]);

  // Update location when any field changes (chỉ khi đã initialized và không đang parse)
  useEffect(() => {
    if (!isInitialized || isParsingRef.current) return;

    const province = selectedProvinceId
      ? provinces.find((p) => p.id === selectedProvinceId)?.name
      : "";
    const district = selectedDistrictId
      ? districts.find((d) => d.id === selectedDistrictId)?.name
      : "";
    const ward = selectedWardId
      ? wards.find((w) => w.id === selectedWardId)?.name
      : "";

    const parts = [detailAddress, ward, district, province].filter(Boolean);
    const fullAddress = parts.join(", ");

    if (fullAddress && fullAddress !== location) {
      setLocation(fullAddress);
    }
  }, [
    detailAddress,
    selectedWardId,
    selectedDistrictId,
    selectedProvinceId,
    provinces,
    districts,
    wards,
    location,
    isInitialized,
    setLocation,
  ]);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province" className="text-sm font-medium">
            Tỉnh/Thành phố <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedProvinceId}
            onValueChange={handleSelectProvinceId}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {isLoadingProvinces ? (
                <div className="p-2 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  Đang tải...
                </div>
              ) : (
                provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    {province.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium">
            Quận/Huyện <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedDistrictId}
            onValueChange={handleSelectDistrictId}
            disabled={!selectedProvinceId}
          >
            <SelectTrigger className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue
                placeholder={
                  isLoadingDistricts ? "Đang tải..." : "Chọn quận/huyện"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {isLoadingDistricts ? (
                <div className="p-2 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  Đang tải...
                </div>
              ) : (
                districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-medium">
            Phường/Xã <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedWardId}
            onValueChange={(wardId) => {
              setSelectedWardId(wardId);
              // Reset parsing flag khi user chọn thủ công
              isParsingRef.current = false;
            }}
            disabled={!selectedDistrictId}
          >
            <SelectTrigger className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue
                placeholder={isLoadingWards ? "Đang tải..." : "Chọn phường/xã"}
              />
            </SelectTrigger>
            <SelectContent>
              {isLoadingWards ? (
                <div className="p-2 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  Đang tải...
                </div>
              ) : (
                wards.map((ward) => (
                  <SelectItem key={ward.id} value={ward.id}>
                    {ward.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail" className="text-sm font-medium">
            Địa chỉ chi tiết <span className="text-destructive">*</span>
          </Label>
          <Input
            id="detail"
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Số nhà, tên đường..."
            value={detailAddress}
            disabled={!selectedWardId}
            onChange={(e) => {
              setDetailAddress(e.target.value);
              // Reset parsing flag khi user thay đổi detail address
              isParsingRef.current = true; // Disable parse khi user đang nhập
            }}
          />
        </div>
      </div>

      {location && location.trim() && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Địa chỉ đầy đủ:</Label>
          <div className="p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">
              {location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
