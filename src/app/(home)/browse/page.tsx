"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, Heart, Star, ShoppingBag, Eye, SlidersHorizontal } from "lucide-react"
import Image from "next/image"

const dresses = [
  {
    id: 1,
    name: "Váy Dáng A Thanh Lịch",
    designer: "Emma Wilson",
    price: 30000000,
    rating: 4.9,
    reviews: 45,
    category: "A-Line",
    style: "Classic",
    available: "rent",
    image: "/placeholder.svg?height=400&width=300&text=A-Line+Gown",
  },
  {
    id: 2,
    name: "Vẻ Đẹp Ren Cổ Điển",
    designer: "Sophie Chen",
    price: 23750000,
    rating: 4.8,
    reviews: 32,
    category: "Mermaid",
    style: "Vintage",
    available: "buy",
    image: "/placeholder.svg?height=400&width=300&text=Vintage+Lace",
  },
  {
    id: 3,
    name: "Phong Cách Tối Giản Hiện Đại",
    designer: "Alex Thompson",
    price: 20000000,
    rating: 4.7,
    reviews: 28,
    category: "Sheath",
    style: "Modern",
    available: "rent",
    image: "/placeholder.svg?height=400&width=300&text=Minimalist",
  },
  {
    id: 4,
    name: "Váy Bồng Hoàng Gia",
    designer: "Maria Garcia",
    price: 62500000,
    rating: 5.0,
    reviews: 18,
    category: "Ball Gown",
    style: "Princess",
    available: "custom",
    image: "/placeholder.svg?height=400&width=300&text=Ball+Gown",
  },
  {
    id: 5,
    name: "Giấc Mơ Bohemian",
    designer: "Luna Martinez",
    price: 27500000,
    rating: 4.6,
    reviews: 41,
    category: "A-Line",
    style: "Boho",
    available: "buy",
    image: "/placeholder.svg?height=400&width=300&text=Bohemian",
  },
  {
    id: 6,
    name: "Dáng Cá Quyến Rũ",
    designer: "Isabella Rose",
    price: 45000000,
    rating: 4.9,
    reviews: 35,
    category: "Mermaid",
    style: "Glamorous",
    available: "rent",
    image: "/placeholder.svg?height=400&width=300&text=Mermaid",
  },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredDresses = dresses

  return (


      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Duyệt Váy Cưới</h1>
          <p className="text-gray-600">Khám phá chiếc váy cưới hoàn hảo từ bộ sưu tập được tuyển chọn của chúng tôi</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm váy, nhà thiết kế, phong cách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Khoảng Giá</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={3000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{(priceRange[0] * 25000).toLocaleString("vi-VN")}₫</span>
                        <span>{(priceRange[1] * 25000).toLocaleString("vi-VN")}₫</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Danh Mục</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất Cả Danh Mục</SelectItem>
                        <SelectItem value="A-Line">Dáng A</SelectItem>
                        <SelectItem value="Ball Gown">Váy Bồng</SelectItem>
                        <SelectItem value="Mermaid">Dáng Cá</SelectItem>
                        <SelectItem value="Sheath">Dáng Ôm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Phong Cách</Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất Cả Phong Cách</SelectItem>
                        <SelectItem value="Classic">Cổ Điển</SelectItem>
                        <SelectItem value="Modern">Hiện Đại</SelectItem>
                        <SelectItem value="Vintage">Cổ Điển</SelectItem>
                        <SelectItem value="Boho">Boho</SelectItem>
                        <SelectItem value="Princess">Công Chúa</SelectItem>
                        <SelectItem value="Glamorous">Quyến Rũ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tình Trạng</Label>
                    <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất Cả Tùy Chọn</SelectItem>
                        <SelectItem value="rent">Cho Thuê</SelectItem>
                        <SelectItem value="buy">Bán</SelectItem>
                        <SelectItem value="custom">Thiết Kế Riêng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị {filteredDresses.length} trong số {dresses.length} váy cưới
          </p>
        </div>

        {/* Dress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDresses.map((dress) => (
            <Card key={dress.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <Image
                  src={dress.image || "/placeholder.svg"}
                  alt={dress.name}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={
                      dress.available === "rent" ? "default" : dress.available === "buy" ? "secondary" : "outline"
                    }
                    className={
                      dress.available === "rent"
                        ? "bg-blue-600"
                        : dress.available === "buy"
                          ? "bg-green-600"
                          : "bg-purple-600 text-white"
                    }
                  >
                    {dress.available === "rent" ? "Cho Thuê" : dress.available === "buy" ? "Bán" : "Thiết Kế Riêng"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-rose-600 transition-colors">{dress.name}</h3>
                  <p className="text-gray-600 text-sm">by {dress.designer}</p>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{dress.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{dress.reviews} đánh giá</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">{dress.price.toLocaleString("vi-VN")}₫</p>
                      <p className="text-xs text-gray-600">
                        {dress.category} • {dress.style}
                      </p>
                    </div>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {dress.available === "rent" ? "Thuê" : dress.available === "buy" ? "Mua" : "Tùy Chỉnh"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
    
  )
}
