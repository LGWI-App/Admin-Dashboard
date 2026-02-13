import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

export const CommunitiesList = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: "COMMUNITY_ID",
      accessorKey: "COMMUNITY_ID",
      header: "Community ID",
    },
    {
      id: "COMMUNITY_NAME",
      accessorKey: "COMMUNITY_NAME",
      header: "Community Name",
    },
    {
      id: "PRICE_RATE",
      accessorKey: "PRICE_RATE",
      header: "Price Rate ($/gal)",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value ? `$${value.toFixed(4)}` : "N/A";
      },
    },
    {
      id: "actions",
      accessorKey: "COMMUNITY_ID",
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
      resource: "COMMUNITY",
      meta: {
        select: "COMMUNITY_ID,COMMUNITY_NAME,PRICE_RATE",
      },
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communities</h1>
          <p className="text-muted-foreground">Manage water communities</p>
        </div>
        <CreateButton resource="COMMUNITY" />
      </div>
      <DataTable table={table} />
    </div>
  );
};
