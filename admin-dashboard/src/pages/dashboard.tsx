import { useNavigation } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, TrendingUp } from "lucide-react";

export const Dashboard = () => {
  const { list } = useNavigation();

  const cards = [
    {
      title: "Meter Readings",
      description: "View and manage meter readings",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => list("METER_READINGS"),
    },
    {
      title: "Communities",
      description: "Manage water communities",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
            <Droplet className="w-5 h-5 text-blue-600" />
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
              <p className="text-2xl font-bold text-green-600">Readings</p>
              <p className="text-sm text-muted-foreground">Monitor usage</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-purple-600">Communities</p>
              <p className="text-sm text-muted-foreground">Manage groups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
