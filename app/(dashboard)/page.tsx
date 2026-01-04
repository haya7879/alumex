"use client";

import { useDashboardKPIs } from "@/services/kpis/kpis-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContainerContent } from "@/components/shared/container";

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

// Helper function to format currency
const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SYP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Helper function to format percentage
const formatPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

export default function Page() {
  const { data: kpis, isLoading, error } = useDashboardKPIs();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gapx-2 py-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="font-semibold text-destructive mb-2">
            حدث خطأ أثناء تحميل البيانات
          </p>
          <p className="text-sm text-muted-foreground">
            يرجى المحاولة مرة أخرى
          </p>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return null;
  }

  return (
    <div className="rounded-lg md:mr-[90px] mr-0">
      <ContainerContent className="rounded-2xl!">
        <div className="space-y-3">
          <div className="mb-6">
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              نظرة عامة على مؤشرات الأداء الرئيسية
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">إجمالي النماذج</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatNumber(kpis.summary.total_forms)}
                </p>
              </CardContent>
            </Card>

            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">إجمالي العروض</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatNumber(kpis.summary.total_quotations)}
                </p>
              </CardContent>
            </Card>

            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">إجمالي العقود</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatNumber(kpis.summary.total_contracts)}
                </p>
              </CardContent>
            </Card>

            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">
                  إجمالي قيمة العروض
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(kpis.summary.total_offers_value)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">
                  إحصائيات الشهر الحالي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العروض</span>
                  <span className="text-xl font-semibold">
                    {formatNumber(kpis.monthly.quotations)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العقود</span>
                  <span className="text-xl font-semibold">
                    {formatNumber(kpis.monthly.contracts)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">رؤى المبيعات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    متوسط قيمة العرض
                  </span>
                  <span className="text-xl font-semibold">
                    {formatCurrency(kpis.sales_insights.avg_offer_value)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">معدل التحويل</span>
                  <span className="text-xl font-semibold">
                    {formatPercentage(kpis.sales_insights.conversion_rate)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Top Sections by Value */}
            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">
                  أفضل الأقسام حسب القيمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kpis.pricing_insights.top_sections_by_value.length > 0 ? (
                  <div className="space-y-3">
                    {kpis.pricing_insights.top_sections_by_value.map(
                      (section, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">
                            {section.section_name}
                          </span>
                          <span className="text-sm font-semibold">
                            {formatCurrency(section.value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا توجد بيانات
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Average Price per Section */}
            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">
                  متوسط السعر لكل قسم
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kpis.pricing_insights.avg_price_per_section.length > 0 ? (
                  <div className="space-y-3">
                    {kpis.pricing_insights.avg_price_per_section.map(
                      (section, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">
                            {section.section_name}
                          </span>
                          <span className="text-sm font-semibold">
                            {formatCurrency(section.avg_price)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا توجد بيانات
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Negotiated Sections */}
            <Card className="px-2 py-4">
              <CardHeader>
                <CardTitle className="font-semibold">
                  الأقسام المتفاوض عليها
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kpis.pricing_insights.negotiated_sections.length > 0 ? (
                  <div className="space-y-3">
                    {kpis.pricing_insights.negotiated_sections.map(
                      (section, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">
                            {section.section_name}
                          </span>
                          <span className="text-sm font-semibold">
                            {formatNumber(section.negotiated_count)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا توجد بيانات
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ContainerContent>
    </div>
  );
}
