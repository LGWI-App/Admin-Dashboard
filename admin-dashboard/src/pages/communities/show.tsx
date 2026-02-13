import { useShow, useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ListButton } from "@/components/refine-ui/buttons/list";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

export const CommunitiesShow = () => {
  const { id } = useParams<{ id: string }>();

  const { query } = useShow({
    resource: "COMMUNITY",
    id,
    meta: {
      select: "COMMUNITY_ID,COMMUNITY_NAME,PRICE_RATE",
    },
  });

  const { query: metersQuery } = useList({
    resource: "METERS",
    filters: [
      {
        field: "COMMUNITY_ID",
        operator: "eq",
        value: id,
      },
    ],
    meta: {
      select: "METER_ID",
    },
  });

  const { data, isLoading } = query;
  const metersData = metersQuery.data;
  const record = data?.data;
  const meterCount = metersData?.total || 0;

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Details</h1>
        <div className="flex gap-2">
          <ListButton resource="COMMUNITY" />
          <EditButton recordItemId={id} />
          <DeleteButton recordItemId={id} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Community ID</p>
                <p className="text-lg font-semibold">{record?.COMMUNITY_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Community Name</p>
                <p className="text-lg font-semibold">{record?.COMMUNITY_NAME || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Rate</p>
                <p className="text-lg font-semibold text-green-600">
                  ${record?.PRICE_RATE?.toFixed(4)} per gallon
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Meters</p>
                <p className="text-lg font-semibold text-blue-600">
                  {meterCount} {meterCount === 1 ? "meter" : "meters"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">100 gallons</p>
                <p className="text-xl font-semibold">
                  ${((record?.PRICE_RATE || 0) * 100).toFixed(2)}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">500 gallons</p>
                <p className="text-xl font-semibold">
                  ${((record?.PRICE_RATE || 0) * 500).toFixed(2)}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">1,000 gallons</p>
                <p className="text-xl font-semibold">
                  ${((record?.PRICE_RATE || 0) * 1000).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
