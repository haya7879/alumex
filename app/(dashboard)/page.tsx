
"use client";

import { useSalesDashboardKPIs } from "@/services/sales/sales-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicLayout from "@/components/shared/dynamic-layout";
import { pathLabels } from "@/app/(dashboard)/sales/_components/constants";
import {
  FileText,
  FileCheck,
  FileX,
  DollarSign,
  TrendingUp,
  Percent,
  BarChart3,
  Award,
} from "lucide-react";

// Format number with locale
const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

// Format currency
const formatCurrency = (num: number): string => {
  return `${formatNumber(num)} د.ع`;
};

// Format percentage
const formatPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

export default function DashboardPage() {
  const { data, isLoading, error } = useSalesDashboardKPIs();

  if (isLoading) {
    return <div>loading ...</div>;
  }

  if (error) {
    return (
      <DynamicLayout pathLabels={pathLabels} defaultTitle="لوحة تحكم المبيعات">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
            </p>
          </CardContent>
        </Card>
      </DynamicLayout>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">الملخص العام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي النماذج
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(data.summary.total_forms)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي العروض
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(data.summary.total_quotations)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي العقود
              </CardTitle>
              <FileX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(data.summary.total_contracts)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي قيمة العروض
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.summary.total_offers_value)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">الإحصائيات الشهرية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                العروض الشهرية
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(data.monthly.quotations)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                العقود الشهرية
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(data.monthly.contracts)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sales Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-4">رؤى المبيعات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط قيمة العرض
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.sales_insights.avg_offer_value)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                معدل التحويل
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercentage(data.sales_insights.conversion_rate)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-4">رؤى التسعير</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Sections by Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                أفضل المقاطع بالقيمة
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {data.pricing_insights.top_sections_by_value.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
              ) : (
                <div className="space-y-3">
                  {data.pricing_insights.top_sections_by_value.map(
                    (section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{section.section_name}</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(section.value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Average Price per Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط السعر لكل مقطع
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {data.pricing_insights.avg_price_per_section.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
              ) : (
                <div className="space-y-3">
                  {data.pricing_insights.avg_price_per_section.map(
                    (section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{section.section_name}</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(section.avg_price)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Negotiated Sections */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                المقاطع المتفاوض عليها
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {data.pricing_insights.negotiated_sections.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
              ) : (
                <div className="space-y-3">
                  {data.pricing_insights.negotiated_sections.map(
                    (section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{section.section_name}</span>
                        <span className="text-sm font-semibold">
                          {formatNumber(section.negotiated_count)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
