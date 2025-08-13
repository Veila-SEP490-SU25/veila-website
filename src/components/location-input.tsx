"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyGetDistrictsQuery, useLazyGetProvincesQuery, useLazyGetWardsQuery } from "@/services/apis"
import type { IDistrict, IProvince, IWard } from "@/services/types"
import { useEffect, useState } from "react"

interface LocationInputProps {
  location: string
  setLocation: (location: string) => void
}

export const LocationInput = ({ location, setLocation }: LocationInputProps) => {
  const [provinces, setProvinces] = useState<IProvince[]>([])
  const [districts, setDistricts] = useState<IDistrict[]>([])
  const [wards, setWards] = useState<IWard[]>([])
  const [detailAddress, setDetailAddress] = useState<string>("")

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("")
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("")
  const [selectedWardId, setSelectedWardId] = useState<string>("")

  const [fetchProvinces] = useLazyGetProvincesQuery()
  const [fetchDistricts] = useLazyGetDistrictsQuery()
  const [fetchWards] = useLazyGetWardsQuery()

  const handleSelectProvinceId = (provinceId: string) => {
    setSelectedProvinceId(provinceId)
    setSelectedDistrictId("")
    setSelectedWardId("")
    setDistricts([])
    setWards([])
  }

  const handleSelectDistrictId = (districtId: string) => {
    setSelectedDistrictId(districtId)
    setSelectedWardId("")
    setWards([])
  }

  const handleLocationChange = () => {
    const province = selectedProvinceId ? provinces.find((p) => p.id === selectedProvinceId)?.name : ""
    const district = selectedDistrictId ? districts.find((d) => d.id === selectedDistrictId)?.name : ""
    const ward = selectedWardId ? wards.find((w) => w.id === selectedWardId)?.name : ""

    const parts = [detailAddress, ward, district, province].filter(Boolean)
    const fullAddress = parts.join(", ")
    setLocation(fullAddress)
  }

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const { data } = await fetchProvinces({
          page: 0,
          size: 100,
          query: "",
        }).unwrap()
        setProvinces(data)
      } catch (error) {
        console.error("Failed to load provinces:", error)
      }
    }
    loadProvinces()
  }, [fetchProvinces])

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedProvinceId) return

      try {
        const { data } = await fetchDistricts({
          page: 0,
          size: 100,
          query: "",
          id: selectedProvinceId,
        }).unwrap()
        setDistricts(data)
      } catch (error) {
        console.error("Failed to load districts:", error)
      }
    }
    loadDistricts()
  }, [selectedProvinceId, fetchDistricts])

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDistrictId) return

      try {
        const { data } = await fetchWards({
          page: 0,
          size: 100,
          query: "",
          id: selectedDistrictId,
        }).unwrap()
        setWards(data)
      } catch (error) {
        console.error("Failed to load wards:", error)
      }
    }
    loadWards()
  }, [selectedDistrictId, fetchWards])

  // Update location when any field changes
  useEffect(() => {
    handleLocationChange()
  }, [detailAddress, selectedWardId, selectedDistrictId, selectedProvinceId, provinces, districts, wards])

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province" className="text-sm font-medium">
            Tỉnh/Thành phố <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedProvinceId} onValueChange={handleSelectProvinceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium">
            Quận/Huyện <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedDistrictId} onValueChange={handleSelectDistrictId} disabled={!selectedProvinceId}>
            <SelectTrigger className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-medium">
            Phường/Xã <span className="text-destructive">*</span>
          </Label>
          <Select value={selectedWardId} onValueChange={setSelectedWardId} disabled={!selectedDistrictId}>
            <SelectTrigger className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Chọn phường/xã" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  {ward.name}
                </SelectItem>
              ))}
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
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </div>
      </div>

      {location && location.trim() && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Địa chỉ đầy đủ:</Label>
          <div className="p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">{location}</p>
          </div>
        </div>
      )}
    </div>
  )
}
