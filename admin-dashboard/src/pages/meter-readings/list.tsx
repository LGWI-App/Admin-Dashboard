import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

type Option = {
  value: string;
  label: string;
};

const SearchableSelect = ({
  label,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  options: Option[];
  value?: string;
  onChange: (value: string | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selected?.label ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => {
                      onChange(option.value === value ? undefined : option.value);
                      setOpen(false);
                    }}
                  >
                    <Check className={`mr-2 h-4 w-4 ${option.value === value ? "opacity-100" : "opacity-0"}`} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const MeterReadingsList = () => {
  const formatTwoDecimals = (value: number) => value.toFixed(2);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [selectedMeterId, setSelectedMeterId] = useState<string | undefined>();

  const { data: communitiesResult } = useList({
    resource: "COMMUNITY",
    pagination: {
      mode: "off",
    },
    meta: {
      select: "COMMUNITY_ID,LOCATION_NAME",
    },
  });

  const { data: metersResult } = useList({
    resource: "METERS",
    pagination: {
      mode: "off",
    },
    filters: selectedCommunityId
      ? [
          {
            field: "COMMUNITY_ID",
            operator: "eq",
            value: Number(selectedCommunityId),
          },
        ]
      : [],
    meta: {
      select: "METER_ID,HOUSEHOLD_NAME,COMMUNITY_ID",
    },
  });

  const communityOptions = useMemo<Option[]>(() => {
    const rows = communitiesResult?.data ?? [];
    return rows.map((community: any) => ({
      value: String(community.COMMUNITY_ID),
      label: `${community.LOCATION_NAME} (#${community.COMMUNITY_ID})`,
    }));
  }, [communitiesResult?.data]);

  const meterOptions = useMemo<Option[]>(() => {
    const rows = metersResult?.data ?? [];
    return rows.map((meter: any) => ({
      value: String(meter.METER_ID),
      label: `${meter.HOUSEHOLD_NAME} (#${meter.METER_ID})`,
    }));
  }, [metersResult?.data]);

  const communityMeterIds = useMemo<number[]>(() => {
    const rows = metersResult?.data ?? [];
    return rows.map((meter: any) => Number(meter.METER_ID));
  }, [metersResult?.data]);

  const permanentFilters = useMemo(() => {
    if (selectedMeterId) {
      return [
        {
          field: "METER_ID",
          operator: "eq" as const,
          value: Number(selectedMeterId),
        },
      ];
    }

    if (selectedCommunityId) {
      if (!communityMeterIds.length) {
        return [
          {
            field: "METER_ID",
            operator: "eq" as const,
            value: -1,
          },
        ];
      }

      return [
        {
          field: "METER_ID",
          operator: "in" as const,
          value: communityMeterIds,
        },
      ];
    }

    return [];
  }, [selectedCommunityId, selectedMeterId, communityMeterIds]);

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
        return `${formatTwoDecimals(value)} gal`;
      },
    },
    {
      id: "LAST_READING",
      accessorKey: "LAST_READING",
      header: "Last Reading",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value != null ? `${formatTwoDecimals(value)} gal` : "N/A";
      },
    },
    {
      id: "WATER_USED",
      accessorKey: "WATER_USED",
      header: "Water Used",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return `${formatTwoDecimals(value)} gal`;
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
      filters: {
        permanent: permanentFilters,
      },
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

      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <SearchableSelect
          label="Community"
          placeholder="Select community"
          searchPlaceholder="Search communities..."
          emptyText="No community found"
          options={communityOptions}
          value={selectedCommunityId}
          onChange={(value) => {
            setSelectedCommunityId(value);
            setSelectedMeterId(undefined);
          }}
        />

        <SearchableSelect
          label="Meter"
          placeholder="Select meter"
          searchPlaceholder="Search meters..."
          emptyText="No meter found"
          options={meterOptions}
          value={selectedMeterId}
          onChange={setSelectedMeterId}
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCommunityId(undefined);
              setSelectedMeterId(undefined);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <DataTable table={table} />
    </div>
  );
};
