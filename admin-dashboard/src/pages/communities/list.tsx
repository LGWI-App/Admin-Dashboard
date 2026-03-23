import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Input } from "@/components/ui/input";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const CommunitiesList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const permanentFilters = useMemo(() => {
    const query = searchQuery.trim();

    if (!query) return [];

    return [
      {
        field: "LOCATION_NAME",
        operator: "contains" as const,
        value: query,
      },
    ];
  }, [searchQuery]);

  const columns: ColumnDef<any>[] = [
    {
      id: "COMMUNITY_ID",
      accessorKey: "COMMUNITY_ID",
      header: "Community ID",
    },
    {
      id: "LOCATION_NAME",
      accessorKey: "LOCATION_NAME",
      header: "Location Name",
    },
    {
      id: "PRICE_RATE",
      accessorKey: "PRICE_RATE",
      header: "Price Rate ($/gal)",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value ? `$${value.toFixed(2)}` : "N/A";
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
            <DeleteButton
              resource="COMMUNITY"
              recordItemId={id}
              variant="ghost"
              size="sm"
              meta={{ idColumnName: "COMMUNITY_ID" }}
            />
          </div>
        );
      },
    },
  ];

  const table = useTable({
    columns,
    refineCoreProps: {
      resource: "COMMUNITY",
      filters: {
        permanent: permanentFilters,
      },
      meta: {
        select: "COMMUNITY_ID,LOCATION_NAME,PRICE_RATE",
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
      <div className="mb-6 max-w-md">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search community location..."
        />
      </div>
      <DataTable table={table} />
    </div>
  );
};
