import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CommunitiesCreate = () => {
  const navigate = useNavigate();

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    refineCoreProps: {
      resource: "COMMUNITY",
      redirect: "list",
    },
  });

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="COMMUNITY_NAME">Community Name</Label>
              <Input
                id="COMMUNITY_NAME"
                {...register("COMMUNITY_NAME", {
                  required: "Community name is required",
                })}
                placeholder="Enter community name"
              />
              {errors.COMMUNITY_NAME && (
                <p className="text-sm text-destructive">
                  {errors.COMMUNITY_NAME.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="PRICE_RATE">Price Rate ($/gallon)</Label>
              <Input
                id="PRICE_RATE"
                type="number"
                step="0.0001"
                {...register("PRICE_RATE", {
                  required: "Price rate is required",
                  valueAsNumber: true,
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
                {isSubmitting ? "Creating..." : "Create Community"}
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
