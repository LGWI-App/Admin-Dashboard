import { useForm } from "@refinedev/react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const CommunitiesEdit = () => {
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
  } = useForm({
    refineCoreProps: {
      resource: "COMMUNITY",
      id,
      redirect: "list",
      meta: {
        select: "COMMUNITY_ID,LOCATION_NAME,PRICE_RATE",
        idColumnName: "COMMUNITY_ID",
      },
    },
  });

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
          <CardTitle>Edit Community #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="LOCATION_NAME">Location Name</Label>
              <Input
                id="LOCATION_NAME"
                {...register("LOCATION_NAME", {
                  required: "Location name is required",
                })}
                placeholder="Enter location name"
              />
              {errors.LOCATION_NAME && (
                <p className="text-sm text-destructive">
                  {errors.LOCATION_NAME.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PRICE_RATE">Price Rate ($/gallon)</Label>
              <Input
                id="PRICE_RATE"
                type="number"
                step="0.01"
                {...register("PRICE_RATE", {
                  required: "Price rate is required",
                  setValueAs: toTwoDecimals,
                  min: {
                    value: 0,
                    message: "Price rate must be positive",
                  },
                })}
                placeholder="Enter price rate per gallon"
              />
              {errors.PRICE_RATE && (
                <p className="text-sm text-destructive">
                  {errors.PRICE_RATE.message as string}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Community"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/COMMUNITY")}
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
