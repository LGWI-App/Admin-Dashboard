import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const MetersList = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: "METER_ID",
      accessorKey: "METER_ID",
      header: "Meter ID",
    },
    {
      id: "HOUSEHOLD_NAME",
      accessorKey: "HOUSEHOLD_NAME",
      header: "Household Name",
    },
    {
      id: "COMMUNITY_ID",
      accessorKey: "COMMUNITY_ID",
      header: "Community ID",
    },
    {
      id: "ACTIVE",
      accessorKey: "ACTIVE",
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue<boolean>();
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "LATEST_READING",
      accessorKey: "LATEST_READING",
      header: "Latest Reading",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value ? `${value.toLocaleString()} gal` : "N/A";
      },
    },
    {
      id: "LAST_READ_DATE",
      accessorKey: "LAST_READ_DATE",
      header: "Last Read Date",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? new Date(value).toLocaleDateString() : "N/A";
      },
    },
    {
      id: "actions",
      accessorKey: "METER_ID",
      header: "Actions",
      cell: ({ getValue }) => {
        const id = getValue<number>();
        return (
          <div className="flex gap-2">
            <ShowButton recordItemId={id} variant="ghost" size="sm" />
            <EditButton recordItemId={id} variant="ghost" size="sm" />
            <DeleteButton recordItemId={id} variant="ghost" size="sm" />
          </div>
        );
      },
    },
  ];

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "METERS",
      meta: {
        select: "METER_ID,HOUSEHOLD_NAME,COMMUNITY_ID,ACTIVE,LATEST_READING,LAST_READ_DATE",
      },
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meters</h1>
          <p className="text-muted-foreground">Manage water meters</p>
        </div>
        <CreateButton resource="METERS" />
      </div>
      <DataTable table={table} />
    </div>
  );
};
