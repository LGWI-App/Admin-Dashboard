import { useList, useNavigation } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, CircleDollarSign, Droplet, MapPin, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export const Dashboard = () => {
  const { list } = useNavigation();

  const { result: meterReadingsResult, query: meterReadingsQuery } = useList({
    resource: "METER_READINGS",
    pagination: { mode: "off" },
    meta: {
      select: "id,WATER_USED,PRICE",
    },
  });

  const { result: communitiesResult, query: communitiesQuery } = useList({
    resource: "COMMUNITY",
    pagination: { mode: "off" },
    meta: {
      select: "COMMUNITY_ID",
    },
  });

  const kpis = useMemo(() => {
    const readingRows = (meterReadingsResult?.data ?? []) as Array<{
      WATER_USED?: number;
      PRICE?: number;
    }>;
    const totalReadings = readingRows.length;
    const totalWaterUsed = readingRows.reduce(
      (sum, row) => sum + Number(row.WATER_USED ?? 0),
      0
    );
    const totalRevenue = readingRows.reduce(
      (sum, row) => sum + Number(row.PRICE ?? 0),
      0
    );
    const totalCommunities = (communitiesResult?.data ?? []).length;

    return {
      totalReadings,
      totalWaterUsed,
      totalRevenue,
      totalCommunities,
    };
  }, [meterReadingsResult?.data, communitiesResult?.data]);

  const isKpiLoading = meterReadingsQuery.isLoading || communitiesQuery.isLoading;

  const cards = [
    {
      title: "Meter Readings",
      description: "View and manage meter readings",
      icon: TrendingUp,
      color: "text-sidebar-accent-foreground",
      bgColor: "bg-sidebar-accent",
      onClick: () => list("METER_READINGS"),
    },
    {
      title: "Communities",
      description: "Manage water communities",
      icon: MapPin,
      color: "text-sidebar-primary",
      bgColor: "bg-sidebar-primary/10",
      onClick: () => list("COMMUNITY"),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AguaVision Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Life Giving Water International - Water Meter Management System
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Readings</p>
                <p className="text-2xl font-bold text-sidebar-primary">
                  {isKpiLoading ? "..." : kpis.totalReadings.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-sidebar-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Communities</p>
                <p className="text-2xl font-bold text-sidebar-primary">
                  {isKpiLoading ? "..." : kpis.totalCommunities.toLocaleString()}
                </p>
              </div>
              <Building2 className="h-5 w-5 text-sidebar-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Water Used</p>
                <p className="text-2xl font-bold text-sidebar-accent-foreground">
                  {isKpiLoading
                    ? "..."
                    : `${kpis.totalWaterUsed.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })} gal`}
                </p>
              </div>
              <Droplet className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Billed</p>
                <p className="text-2xl font-bold text-sidebar-accent-foreground">
                  {isKpiLoading
                    ? "..."
                    : `$${kpis.totalRevenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </p>
              </div>
              <CircleDollarSign className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={card.onClick}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View {card.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-sidebar-primary" />
            About AguaVision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            AguaVision is a comprehensive water meter management system designed for Life Giving Water International.
            This admin dashboard allows you to track meter readings
            and monitor water usage across multiple communities.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-sidebar-accent-foreground">Readings</p>
              <p className="text-sm text-muted-foreground">Monitor usage</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-sidebar-primary">Communities</p>
              <p className="text-sm text-muted-foreground">Manage groups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
