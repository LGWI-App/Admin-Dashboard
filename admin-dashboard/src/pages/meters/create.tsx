import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelect } from "@refinedev/core";
import { ArrowLeft } from "lucide-react";

export const MetersCreate = () => {
  const navigate = useNavigate();
  
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
      redirect: "list",
    },
  });

  const { options: communityOptions } = useSelect({
    resource: "COMMUNITY",
    optionLabel: "COMMUNITY_NAME",
    optionValue: "COMMUNITY_ID",
  });

  const isActive = watch("ACTIVE", true);

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
          <CardTitle>Create New Meter</CardTitle>
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
                {isSubmitting ? "Creating..." : "Create Meter"}
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
