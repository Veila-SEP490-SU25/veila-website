"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Store, Phone, Mail, MapPin, Upload, CheckCircle, AlertCircle, Camera, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ImagesUpload } from "@/components/images-upload"

interface ShopData {
  name: string
  phone: string
  email: string
  address: string
  licenseImages: string
  description?: string
}

export default function ShopRegisterPage() {
  const [shopData, setShopData] = useState<ShopData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    licenseImages: "",
    description: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleInputChange = (field: keyof ShopData, value: string) => {
    setShopData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate image upload - in real app, this would upload to storage
      const mockUrl = `https://storage.veila.com/shops/license${Date.now()}.jpg`
      setUploadedImage(URL.createObjectURL(file))
      handleInputChange("licenseImages", mockUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const fillSampleData = () => {
    setShopData({
      name: "Cửa hàng thời trang ABC",
      phone: "+84901234567",
      email: "shopABC@gmail.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      licenseImages: "https://storage.veila.com/shops/license123.jpg",
      description:
        "Chuyên cung cấp váy cưới cao cấp với thiết kế độc đáo và chất lượng tuyệt vời. Phục vụ khách hàng với tâm huyết và chuyên nghiệp.",
    })
    setUploadedImage("/placeholder.svg?height=200&width=300&text=Business+License")
  }

  if (isSubmitted) {
    return (
        <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Registration Submitted!</h1>
              <p className="text-gray-600 mb-8">
                Your shop registration has been submitted successfully. Our team will review your application and get
                back to you within 2-3 business days.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-gray-600 space-y-1 text-left">
                    <li>• Our team will verify your business license</li>
                    <li>• You'll receive an email confirmation once approved</li>
                    <li>• Access to supplier dashboard will be granted</li>
                    <li>• You can start listing your products and services</li>
                  </ul>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  <Button asChild className="bg-rose-600 hover:bg-rose-700">
                    <Link href="/browse">Continue Browsing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    )
  }

  return (

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Shop</h1>
          <p className="text-gray-600">
            Join Veila as a supplier and start offering your wedding dress services to brides worldwide
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-6 text-center">
              <Store className="h-8 w-8 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Expand Your Reach</h3>
              <p className="text-sm text-gray-600">Connect with brides from all over the world</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
              <p className="text-sm text-gray-600">Manage orders, inventory, and customers in one place</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Platform</h3>
              <p className="text-sm text-gray-600">Join a verified network of quality suppliers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-rose-600" />
                  Shop Information
                </CardTitle>
                <CardDescription>
                  Please provide accurate information about your business. All fields are required for verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Shop Name *
                    </Label>
                    <Input
                      id="name"
                      value={shopData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your shop name"
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shopData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+84901234567"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={shopData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="shop@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Business Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={shopData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your complete business address"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Shop Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={shopData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Tell us about your shop, specialties, and what makes you unique..."
                      rows={4}
                    />
                  </div>

                  {/* License Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Giấy phép kinh doanh *
                    </Label>
                    <ImagesUpload 
                      imageUrls={shopData.licenseImages}
                      setImageUrls={(urls) => handleInputChange("licenseImages", urls)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !shopData.name ||
                        !shopData.phone ||
                        !shopData.email ||
                        !shopData.address ||
                        !shopData.licenseImages
                      }
                      className="flex-1 bg-rose-600 hover:bg-rose-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Registration
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={fillSampleData} className="px-6 bg-transparent">
                      Fill Sample Data
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Valid Business License</p>
                    <p className="text-xs text-gray-600">Required for verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Complete Contact Info</p>
                    <p className="text-xs text-gray-600">Phone, email, and address</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Quality Standards</p>
                    <p className="text-xs text-gray-600">Commitment to excellence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Approval Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Submit Application</p>
                    <p className="text-xs text-gray-600">Complete the form</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Document Review</p>
                    <p className="text-xs text-gray-600">1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Approval & Setup</p>
                    <p className="text-xs text-gray-600">Account activation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@veila.com" className="text-rose-600 hover:underline">
                  support@veila.com
                </a>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
  )
}
