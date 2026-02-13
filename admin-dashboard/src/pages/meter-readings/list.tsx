import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

export const MeterReadingsList = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: "entry_id",
      accessorKey: "entry_id",
      header: "Entry ID",
    },
    {
      id: "METER_ID",
      accessorKey: "METER_ID",
      header: "Meter ID",
    },
    {
      id: "CURRENT_READING",
      accessorKey: "CURRENT_READING",
      header: "Current Reading",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return `${value.toLocaleString()} gal`;
      },
    },
    {
      id: "LAST_READING",
      accessorKey: "LAST_READING",
      header: "Last Reading",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value ? `${value.toLocaleString()} gal` : "N/A";
      },
    },
    {
      id: "WATER_USED",
      accessorKey: "WATER_USED",
      header: "Water Used",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return `${value.toLocaleString()} gal`;
      },
    },
    {
      id: "PRICE",
      accessorKey: "PRICE",
      header: "Price",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return `$${value.toFixed(2)}`;
      },
    },
    {
      id: "DATE_CURRENT",
      accessorKey: "DATE_CURRENT",
      header: "Current Date",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return new Date(value).toLocaleDateString();
      },
    },
    {
      id: "DATE_LAST_READ",
      accessorKey: "DATE_LAST_READ",
      header: "Last Read Date",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? new Date(value).toLocaleDateString() : "N/A";
      },
    },
    {
      id: "actions",
      accessorKey: "entry_id",
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
      resource: "METER_READINGS",
      meta: {
        select: "entry_id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
      },
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meter Readings</h1>
          <p className="text-muted-foreground">Manage water meter readings</p>
        </div>
        <CreateButton resource="METER_READINGS" />
      </div>
      <DataTable table={table} />
    </div>
  );
};
