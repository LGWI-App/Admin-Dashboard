import { useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ListButton } from "@/components/refine-ui/buttons/list";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

export const MetersShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { query } = useShow({
    resource: "METERS",
    id,
    meta: {
      select: "METER_ID,HOUSEHOLD_NAME,COMMUNITY_ID,ACTIVE,LATEST_READING,LAST_READ_DATE",
    },
  });

  const { data, isLoading } = query;
  const record = data?.data;

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meter Details</h1>
        <div className="flex gap-2">
          <ListButton resource="METERS" />
          <EditButton recordItemId={id} />
          <DeleteButton recordItemId={id} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Meter ID</p>
                <p className="text-lg font-semibold">{record?.METER_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={record?.ACTIVE ? "default" : "secondary"}>
                  {record?.ACTIVE ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Household Name</p>
                <p className="text-lg font-semibold">{record?.HOUSEHOLD_NAME || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Community ID</p>
                <p className="text-lg font-semibold">{record?.COMMUNITY_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Reading</p>
                <p className="text-lg font-semibold">
                  {record?.LATEST_READING ? `${record.LATEST_READING.toLocaleString()} gallons` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Read Date</p>
                <p className="text-lg font-semibold">
                  {record?.LAST_READ_DATE 
                    ? new Date(record.LAST_READ_DATE).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
