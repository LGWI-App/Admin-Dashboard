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
import { Check, ChevronsUpDown, FileSpreadsheet, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo, useState } from "react";
import lgwiLogo from "../../../logo.png";

type Option = {
  value: string;
  label: string;
};

type MeterReadingRow = {
  id: number;
  METER_ID: number;
  CURRENT_READING: number;
  LAST_READING: number | null;
  WATER_USED: number;
  PRICE: number;
  DATE_CURRENT: string;
  DATE_LAST_READ: string | null;
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
  const formatTwoDecimals = (value: number | null | undefined) =>
    typeof value === "number" && !Number.isNaN(value) ? value.toFixed(2) : "N/A";
  const formatDate = (value: string | null | undefined) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [selectedMeterId, setSelectedMeterId] = useState<string | undefined>();

  const { result: communitiesResult } = useList({
    resource: "COMMUNITY",
    pagination: {
      mode: "off",
    },
    meta: {
      select: "COMMUNITY_ID,LOCATION_NAME",
    },
  });

  const { result: metersResult } = useList({
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

  const { result: exportReadingsResult, query: exportReadingsQuery } = useList<MeterReadingRow>({
    resource: "METER_READINGS",
    pagination: {
      mode: "off",
    },
    filters: permanentFilters,
    meta: {
      select: "id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
    },
  });

  const exportRows = exportReadingsResult?.data ?? [];

  const selectedCommunityLabel =
    communityOptions.find((option) => option.value === selectedCommunityId)?.label ?? "All communities";
  const selectedMeterLabel =
    meterOptions.find((option) => option.value === selectedMeterId)?.label ?? "All meters";

  const exportFilenameSuffix = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}_${hh}${min}`;
  };

  const csvEscape = (value: string | number) => {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes("\n") || text.includes('"')) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };

  const handleExportCsv = () => {
    if (!exportRows.length) return;

    const headers = [
      "Entry ID",
      "Meter ID",
      "Current Reading (gal)",
      "Last Reading (gal)",
      "Water Used (gal)",
      "Price ($)",
      "Current Date",
      "Last Read Date",
    ];

    const lines = [headers.map(csvEscape).join(",")];

    for (const row of exportRows) {
      lines.push(
        [
          row.id,
          row.METER_ID,
          formatTwoDecimals(row.CURRENT_READING),
          formatTwoDecimals(row.LAST_READING),
          formatTwoDecimals(row.WATER_USED),
          formatTwoDecimals(row.PRICE),
          formatDate(row.DATE_CURRENT),
          formatDate(row.DATE_LAST_READ),
        ]
          .map(csvEscape)
          .join(",")
      );
    }

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meter_readings_${exportFilenameSuffix()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const toDataUrl = async (imageUrl: string) => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read logo image"));
        reader.readAsDataURL(blob);
      });
    };

    const exportPdf = async () => {
      if (!exportRows.length) return;

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const generatedAt = new Date().toLocaleString();
      const titleY = 38;

      try {
        const logoDataUrl = await toDataUrl(lgwiLogo);
        doc.addImage(logoDataUrl, "PNG", 40, 16, 72, 50);
      } catch {
        // Continue export even if logo loading fails.
      }

      doc.setFontSize(16);
      doc.text("Meter Readings Report", 124, titleY);
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Generated: ${generatedAt}`, 124, 58);
      doc.text(`Community: ${selectedCommunityLabel}`, 124, 74);
      doc.text(`Meter: ${selectedMeterLabel}`, 124, 90);
      doc.text(`Rows: ${exportRows.length}`, 124, 106);

      autoTable(doc, {
        startY: 120,
        head: [["Entry ID", "Meter ID", "Current (gal)", "Last (gal)", "Used (gal)", "Price ($)", "Current Date", "Last Read Date"]],
        body: exportRows.map((row) => [
          row.id,
          row.METER_ID,
          formatTwoDecimals(row.CURRENT_READING),
          formatTwoDecimals(row.LAST_READING),
          formatTwoDecimals(row.WATER_USED),
          formatTwoDecimals(row.PRICE),
          formatDate(row.DATE_CURRENT),
          formatDate(row.DATE_LAST_READ),
        ]),
        theme: "striped",
        styles: {
          fontSize: 9,
          cellPadding: 6,
        },
        headStyles: {
          fillColor: [36, 103, 141],
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [245, 250, 252],
        },
        margin: {
          left: 24,
          right: 24,
        },
      });

      doc.save(`meter_readings_${exportFilenameSuffix()}.pdf`);
    };

    void exportPdf();

  };

  const columns: ColumnDef<any>[] = [
    {
      id: "id",
      accessorKey: "id",
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
      accessorKey: "id",
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
        select: "id,METER_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            disabled={exportReadingsQuery.isLoading || exportRows.length === 0}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={exportReadingsQuery.isLoading || exportRows.length === 0}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <CreateButton resource="METER_READINGS" />
        </div>
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
