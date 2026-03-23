import { useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ListButton } from "@/components/refine-ui/buttons/list";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ArrowLeft } from "lucide-react";

export const MeterReadingsShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { query } = useShow({
    resource: "METER_READINGS",
    id,
    meta: {
      select: "id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
      idColumnName: "id",
    },
  });

  const { data, isLoading } = query;
  const record = data?.data;
  const formatTwoDecimals = (value: number) => value.toFixed(2);

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Meter Reading Details</h1>
        </div>
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
                <p className="text-lg font-semibold">{record?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meter ID</p>
                <p className="text-lg font-semibold">{record?.METER_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Reading</p>
                <p className="text-lg font-semibold">
                  {record?.CURRENT_READING != null
                    ? `${formatTwoDecimals(record.CURRENT_READING)} gallons`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Reading</p>
                <p className="text-lg font-semibold">
                  {record?.LAST_READING 
                    ? `${formatTwoDecimals(record.LAST_READING)} gallons` 
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Water Used</p>
                <p className="text-lg font-semibold text-blue-600">
                  {record?.WATER_USED != null
                    ? `${formatTwoDecimals(record.WATER_USED)} gallons`
                    : "N/A"}
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
                    ? formatTwoDecimals(record.PRICE / record.WATER_USED)
                    : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usage Increase</p>
                <p className="text-lg font-semibold">
                  {record?.LAST_READING 
                    ? `${formatTwoDecimals((record.CURRENT_READING - record.LAST_READING) / record.LAST_READING * 100)}%`
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
