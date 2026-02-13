import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ListButton } from "@/components/refine-ui/buttons/list";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

export const MeterReadingsShow = () => {
  const { id } = useParams<{ id: string }>();

  const { query } = useShow({
    resource: "METER_READINGS",
    id,
    meta: {
      select: "entry_id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
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
        <h1 className="text-3xl font-bold">Meter Reading Details</h1>
        <div className="flex gap-2">
          <ListButton resource="METER_READINGS" />
          <EditButton recordItemId={id} />
          <DeleteButton recordItemId={id} />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reading Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entry ID</p>
                <p className="text-lg font-semibold">{record?.entry_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meter ID</p>
                <p className="text-lg font-semibold">{record?.METER_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Reading</p>
                <p className="text-lg font-semibold">
                  {record?.CURRENT_READING?.toLocaleString()} gallons
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Reading</p>
                <p className="text-lg font-semibold">
                  {record?.LAST_READING 
                    ? `${record.LAST_READING.toLocaleString()} gallons` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Water Used</p>
                <p className="text-lg font-semibold text-blue-600">
                  {record?.WATER_USED?.toLocaleString()} gallons
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-lg font-semibold text-green-600">
                  ${record?.PRICE?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Date</p>
                <p className="text-lg font-semibold">
                  {record?.DATE_CURRENT 
                    ? new Date(record.DATE_CURRENT).toLocaleString() 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Read Date</p>
                <p className="text-lg font-semibold">
                  {record?.DATE_LAST_READ 
                    ? new Date(record.DATE_LAST_READ).toLocaleString() 
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price per Gallon</p>
                <p className="text-lg font-semibold">
                  ${record?.WATER_USED && record?.PRICE 
                    ? (record.PRICE / record.WATER_USED).toFixed(4) 
                    : "0.0000"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usage Increase</p>
                <p className="text-lg font-semibold">
                  {record?.LAST_READING 
                    ? `${((record.CURRENT_READING - record.LAST_READING) / record.LAST_READING * 100).toFixed(1)}%`
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
