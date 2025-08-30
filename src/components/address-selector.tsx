"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, X, Check, Building2, Map, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Province {
  code: string;
  name: string;
  districts: District[];
}

interface District {
  code: string;
  name: string;
  wards: Ward[];
}

interface Ward {
  code: string;
  name: string;
}

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  placeholder = "Chọn địa chỉ...",
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [detailAddress, setDetailAddress] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Filter provinces based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProvinces(provinces);
    } else {
      const filtered = provinces.filter((province) =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProvinces(filtered);
    }
  }, [searchTerm, provinces]);

  const loadProvinces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      if (response.ok) {
        const data = await response.json();
        setProvinces(data);
        setFilteredProvinces(data);
      } else {
        // Fallback data
        setProvinces([
          {
            code: "01",
            name: "Hà Nội",
            districts: [
              {
                code: "001",
                name: "Ba Đình",
                wards: [
                  { code: "00001", name: "Phúc Xá" },
                  { code: "00004", name: "Trúc Bạch" },
                ],
              },
            ],
          },
          {
            code: "79",
            name: "TP. Hồ Chí Minh",
            districts: [
              {
                code: "760",
                name: "Quận 1",
                wards: [
                  { code: "26734", name: "Bến Nghé" },
                  { code: "26737", name: "Bến Thành" },
                ],
              },
            ],
          },
        ]);
        setFilteredProvinces([
          {
            code: "01",
            name: "Hà Nội",
            districts: [
              {
                code: "001",
                name: "Ba Đình",
                wards: [
                  { code: "00001", name: "Phúc Xá" },
                  { code: "00004", name: "Trúc Bạch" },
                ],
              },
            ],
          },
          {
            code: "79",
            name: "TP. Hồ Chí Minh",
            districts: [
              {
                code: "760",
                name: "Quận 1",
                wards: [
                  { code: "26734", name: "Bến Nghé" },
                  { code: "26737", name: "Bến Thành" },
                ],
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
      // Fallback data
      setProvinces([
        {
          code: "01",
          name: "Hà Nội",
          districts: [
            {
              code: "001",
              name: "Ba Đình",
              wards: [
                { code: "00001", name: "Phúc Xá" },
                { code: "00004", name: "Trúc Bạch" },
              ],
            },
          ],
        },
      ]);
      setFilteredProvinces([
        {
          code: "01",
          name: "Hà Nội",
          districts: [
            {
              code: "001",
              name: "Ba Đình",
              wards: [
                { code: "00001", name: "Phúc Xá" },
                { code: "00004", name: "Trúc Bạch" },
              ],
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts(province.districts);
    setWards([]);
    setDetailAddress("");
    updateAddress(province.name, "", "", "");
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setWards(district.wards);
    setDetailAddress("");
    updateAddress(selectedProvince?.name || "", district.name, "", "");
  };

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward);
    updateAddress(
      selectedProvince?.name || "",
      selectedDistrict?.name || "",
      ward.name,
      detailAddress
    );
  };

  const handleDetailAddressChange = (detail: string) => {
    setDetailAddress(detail);
    updateAddress(
      selectedProvince?.name || "",
      selectedDistrict?.name || "",
      selectedWard?.name || "",
      detail
    );
  };

  const updateAddress = (
    province: string,
    district: string,
    ward: string,
    detail: string
  ) => {
    const parts = [detail, ward, district, province].filter(Boolean);
    const fullAddress = parts.join(", ");
    onChange(fullAddress);
  };

  const handleClear = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setDetailAddress("");
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (value) return value;
    if (selectedProvince) {
      const parts = [
        detailAddress,
        selectedWard?.name,
        selectedDistrict?.name,
        selectedProvince.name,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return "";
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          value={getDisplayValue()}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          )}
          {getDisplayValue() && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <MapPin className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 w-96 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Chọn địa chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Province Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Tỉnh/Thành phố
              </Label>
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {filteredProvinces.map((province) => (
                  <button
                    key={province.code}
                    type="button"
                    onClick={() => handleProvinceSelect(province)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm",
                      selectedProvince?.code === province.code &&
                        "bg-blue-50 text-blue-600"
                    )}
                  >
                    <span>{province.name}</span>
                    {selectedProvince?.code === province.code && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* District Selection */}
            {selectedProvince && districts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Map className="h-3 w-3" />
                  Quận/Huyện
                </Label>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {districts.map((district) => (
                    <button
                      key={district.code}
                      type="button"
                      onClick={() => handleDistrictSelect(district)}
                      className={cn(
                        "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm",
                        selectedDistrict?.code === district.code &&
                          "bg-blue-50 text-blue-600"
                      )}
                    >
                      <span>{district.name}</span>
                      {selectedDistrict?.code === district.code && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ward Selection */}
            {selectedDistrict && wards.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Phường/Xã
                </Label>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {wards.map((ward) => (
                    <button
                      key={ward.code}
                      type="button"
                      onClick={() => handleWardSelect(ward)}
                      className={cn(
                        "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm",
                        selectedWard?.code === ward.code &&
                          "bg-blue-50 text-blue-600"
                      )}
                    >
                      <span>{ward.name}</span>
                      {selectedWard?.code === ward.code && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detail Address */}
            {selectedWard && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Địa chỉ chi tiết</Label>
                <Input
                  value={detailAddress}
                  onChange={(e) => handleDetailAddressChange(e.target.value)}
                  placeholder="Số nhà, tên đường..."
                  className="text-sm"
                />
              </div>
            )}

            {/* Final Address Preview */}
            {getDisplayValue() && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Địa chỉ đầy đủ:</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {getDisplayValue()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
