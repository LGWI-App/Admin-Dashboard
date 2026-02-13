import { useForm } from "@refinedev/react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MeterReadingsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    refineCoreProps: {
      resource: "METER_READINGS",
      id,
      redirect: "list",
      meta: {
        select: "entry_id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
      },
    },
  });

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Meter Reading #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="METER_ID">Meter ID</Label>
              <Input
                id="METER_ID"
                type="number"
                {...register("METER_ID", {
                  required: "Meter ID is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter meter ID"
              />
              {errors.METER_ID && (
                <p className="text-sm text-destructive">
                  {errors.METER_ID.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="CURRENT_READING">Current Reading (gallons)</Label>
              <Input
                id="CURRENT_READING"
                type="number"
                step="0.01"
                {...register("CURRENT_READING", {
                  required: "Current reading is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter current reading"
              />
              {errors.CURRENT_READING && (
                <p className="text-sm text-destructive">
                  {errors.CURRENT_READING.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="LAST_READING">Last Reading (gallons)</Label>
              <Input
                id="LAST_READING"
                type="number"
                step="0.01"
                {...register("LAST_READING", {
                  valueAsNumber: true,
                })}
                placeholder="Enter last reading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="WATER_USED">Water Used (gallons)</Label>
              <Input
                id="WATER_USED"
                type="number"
                step="0.01"
                {...register("WATER_USED", {
                  required: "Water used is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter water used"
              />
              {errors.WATER_USED && (
                <p className="text-sm text-destructive">
                  {errors.WATER_USED.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PRICE">Price ($)</Label>
              <Input
                id="PRICE"
                type="number"
                step="0.01"
                {...register("PRICE", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter price"
              />
              {errors.PRICE && (
                <p className="text-sm text-destructive">
                  {errors.PRICE.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="DATE_CURRENT">Current Date</Label>
              <Input
                id="DATE_CURRENT"
                type="datetime-local"
                {...register("DATE_CURRENT", {
                  required: "Current date is required",
                })}
              />
              {errors.DATE_CURRENT && (
                <p className="text-sm text-destructive">
                  {errors.DATE_CURRENT.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="DATE_LAST_READ">Last Read Date</Label>
              <Input
                id="DATE_LAST_READ"
                type="datetime-local"
                {...register("DATE_LAST_READ")}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Reading"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/METER_READINGS")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
