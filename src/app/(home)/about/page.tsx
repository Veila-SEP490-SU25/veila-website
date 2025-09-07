'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLazyGetPlatformContractQuery } from '@/services/apis/contract.api';
import { useEffect, useState } from 'react';
import { IContract } from '@/services/types';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Target,
  Eye,
  Heart,
  Sparkles,
  Shield,
  Lightbulb,
} from 'lucide-react';

export default function AboutPage() {
  const [trigger, { data, isLoading, error }] = useLazyGetPlatformContractQuery();
  const [platformInfo, setPlatformInfo] = useState<IContract | null>(null);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (data?.item) {
      setPlatformInfo(data.item);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Có lỗi xảy ra khi tải thông tin về Veila</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!platformInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p>Không tìm thấy thông tin về nền tảng</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse markdown content to extract structured information
  const parseContent = (content: string) => {
    const sections: { [key: string]: string } = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.trim();
        }
        currentSection = line.replace('## ', '').trim();
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.trim();
    }

    return sections;
  };

  const sections = parseContent(platformInfo.content);

  // Extract specific information from content
  const extractInfo = (content: string, key: string) => {
    const regex = new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+?)(?=\\n|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const generalInfo = sections['1. Thông tin chung'] || '';
  const missionVision = sections['2. Sứ mệnh và Tầm nhìn'] || '';
  const contactInfo = sections['3. Thông tin liên hệ'] || '';
  const supportInfo = sections['5. Hỗ trợ khách hàng'] || '';

  const slogan = extractInfo(generalInfo, 'Slogan');
  const description = extractInfo(generalInfo, 'Mô tả');
  const foundedYear = extractInfo(generalInfo, 'Năm thành lập');

  const mission = extractInfo(missionVision, 'Sứ mệnh');
  const vision = extractInfo(missionVision, 'Tầm nhìn');

  const email = extractInfo(contactInfo, 'Email');
  const phone = extractInfo(contactInfo, 'Điện thoại');
  const address = extractInfo(contactInfo, 'Địa chỉ');

  const supportTime = extractInfo(supportInfo, 'Thời gian hỗ trợ');

  const coreValues = ['Chất lượng', 'Tin cậy', 'Sáng tạo'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            {foundedYear && `Thành lập năm ${foundedYear}`}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{platformInfo.title}</h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto font-light">{slogan}</p>
          <p className="text-lg max-w-4xl mx-auto opacity-90">{description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-pink-200 hover:border-pink-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-pink-700">
                <Target className="h-6 w-6" />
                Sứ mệnh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{mission}</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-purple-200 hover:border-purple-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-purple-700">
                <Eye className="h-6 w-6" />
                Tầm nhìn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{vision}</p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <Card className="mb-12 border-gradient">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl text-indigo-700">
              <Heart className="h-8 w-8" />
              Giá trị cốt lõi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((value, index) => {
                const icons = [Shield, Sparkles, Lightbulb];
                const Icon = icons[index];
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

                return (
                  <div key={value} className="text-center group">
                    <div
                      className={`${colors[index]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{value}</h3>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-green-200 hover:border-green-300 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-700">
                <Building2 className="h-6 w-6" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{email}</p>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Điện thoại</p>
                    <p className="text-gray-600">{phone}</p>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Địa chỉ</p>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <Clock className="h-6 w-6" />
                Hỗ trợ khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">Thời gian hỗ trợ</p>
                <p className="text-blue-700 text-lg font-semibold">{supportTime}</p>
                <p className="text-blue-600 text-sm mt-2">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Status */}
        <div className="mt-12 text-center">
          <Card className="inline-block border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  Trạng thái: {platformInfo.status}
                </Badge>
                <p className="text-gray-600">
                  Có hiệu lực từ {new Date(platformInfo.effectiveFrom).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
