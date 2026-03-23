import { useForm } from "@refinedev/react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const MetersEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toTwoDecimals = (value: unknown) => {
    if (value === "") return undefined;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return undefined;
    return Math.round(parsed * 100) / 100;
  };

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    refineCoreProps: {
      resource: "METERS",
      id,
      redirect: "list",
      meta: {
        select: "METER_ID,HOUSEHOLD_NAME,COMMUNITY_ID,ACTIVE,LATEST_READING,LAST_READ_DATE",
        idColumnName: "METER_ID",
      },
    },
  });

  const isActive = watch("ACTIVE");

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Meter #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="HOUSEHOLD_NAME">Household Name</Label>
              <Input
                id="HOUSEHOLD_NAME"
                {...register("HOUSEHOLD_NAME", {
                  required: "Household name is required",
                })}
                placeholder="Enter household name"
              />
              {errors.HOUSEHOLD_NAME && (
                <p className="text-sm text-destructive">
                  {errors.HOUSEHOLD_NAME.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="COMMUNITY_ID">Community ID</Label>
              <Input
                id="COMMUNITY_ID"
                type="number"
                {...register("COMMUNITY_ID", {
                  required: "Community ID is required",
                  valueAsNumber: true,
                })}
                placeholder="Enter community ID"
              />
              {errors.COMMUNITY_ID && (
                <p className="text-sm text-destructive">
                  {errors.COMMUNITY_ID.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="LATEST_READING">Latest Reading</Label>
              <Input
                id="LATEST_READING"
                type="number"
                step="0.01"
                {...register("LATEST_READING", {
                  setValueAs: toTwoDecimals,
                })}
                placeholder="Enter latest reading"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ACTIVE"
                checked={isActive}
                onCheckedChange={(checked) => setValue("ACTIVE", checked)}
              />
              <Label htmlFor="ACTIVE">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Meter"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/METERS")}
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
