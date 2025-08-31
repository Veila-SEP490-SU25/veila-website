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
import { useEffect, useState, useCallback, useRef } from "react";

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
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  // Use ref to store setLocation function to avoid infinite loop
  const setLocationRef = useRef(setLocation);
  setLocationRef.current = setLocation;

  const [fetchProvinces] = useLazyGetProvincesQuery();
  const [fetchDistricts] = useLazyGetDistrictsQuery();
  const [fetchWards] = useLazyGetWardsQuery();

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
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, [fetchProvinces]);

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

  // Update location when any field changes
  const updateLocation = useCallback(() => {
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

    if (fullAddress) {
      setLocationRef.current(fullAddress);
    }
  }, [
    detailAddress,
    selectedWardId,
    selectedDistrictId,
    selectedProvinceId,
    provinces,
    districts,
    wards,
  ]);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  const handleSelectProvinceId = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId("");
    setSelectedWardId("");
    setDistricts([]);
    setWards([]);
    setDetailAddress("");
  };

  const handleSelectDistrictId = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setSelectedWardId("");
    setWards([]);
    setDetailAddress("");
  };

  const handleSelectWardId = (wardId: string) => {
    setSelectedWardId(wardId);
  };

  const handleDetailAddressChange = (value: string) => {
    setDetailAddress(value);
  };

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
            onValueChange={handleSelectWardId}
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
            onChange={(e) => handleDetailAddressChange(e.target.value)}
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
