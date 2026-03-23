import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Check, ChevronsUpDown, FileSpreadsheet, FileText, MoreHorizontal, Save, Trash2, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import lgwiLogo from "../../../logo.png";

type Option = {
  value: string;
  label: string;
};

type MeterReadingRow = {
  id: number;
  METER_ID: number;
  COMMUNITY_ID: number;
  CURRENT_READING: number;
  LAST_READING: number | null;
  WATER_USED: number;
  PRICE: number;
  DATE_CURRENT: string;
  DATE_LAST_READ: string | null;
};

type SortOption = "date_desc" | "date_asc" | "usage_desc" | "price_desc" | "meter_asc";

type SavedPreset = {
  id: string;
  name: string;
  communityId?: string;
  meterId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: SortOption;
};

const PRESETS_STORAGE_KEY = "meter-readings-filter-presets";

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
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const { show, edit } = useNavigation();
  const { mutate: deleteOne } = useDelete();

  useEffect(() => {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as SavedPreset[];
      if (Array.isArray(parsed)) {
        setSavedPresets(parsed);
      }
    } catch {
      localStorage.removeItem(PRESETS_STORAGE_KEY);
    }
  }, []);

  const savePresetsToStorage = (presets: SavedPreset[]) => {
    setSavedPresets(presets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  };

  const getSorters = (sortValue: SortOption) => {
    switch (sortValue) {
      case "date_asc":
        return [{ field: "DATE_CURRENT", order: "asc" as const }];
      case "usage_desc":
        return [{ field: "WATER_USED", order: "desc" as const }];
      case "price_desc":
        return [{ field: "PRICE", order: "desc" as const }];
      case "meter_asc":
        return [{ field: "METER_ID", order: "asc" as const }];
      case "date_desc":
      default:
        return [{ field: "DATE_CURRENT", order: "desc" as const }];
    }
  };

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
    return rows
      .map((community: any) => ({
        value: String(community.COMMUNITY_ID),
        label: `${community.LOCATION_NAME} (#${community.COMMUNITY_ID})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
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
    const filters: Array<{
      field: string;
      operator: "eq" | "in" | "gte" | "lte";
      value: number | number[] | string;
    }> = [];

    if (selectedMeterId) {
      filters.push({
        field: "METER_ID",
        operator: "eq",
        value: Number(selectedMeterId),
      });
    } else if (selectedCommunityId) {
      if (!communityMeterIds.length) {
        filters.push({
          field: "METER_ID",
          operator: "eq",
          value: -1,
        });
      } else {
        filters.push({
          field: "METER_ID",
          operator: "in",
          value: communityMeterIds,
        });
      }
    }

    if (dateFrom) {
      filters.push({
        field: "DATE_CURRENT",
        operator: "gte",
        value: `${dateFrom}T00:00:00`,
      });
    }

    if (dateTo) {
      filters.push({
        field: "DATE_CURRENT",
        operator: "lte",
        value: `${dateTo}T23:59:59`,
      });
    }

    return filters;
  }, [selectedCommunityId, selectedMeterId, communityMeterIds, dateFrom, dateTo]);

  const permanentSorters = useMemo(() => getSorters(sortBy), [sortBy]);

  const { result: exportReadingsResult, query: exportReadingsQuery } = useList<MeterReadingRow>({
    resource: "METER_READINGS",
    pagination: {
      mode: "off",
    },
    filters: permanentFilters,
    sorters: permanentSorters,
    meta: {
      select: "id,METER_ID,COMMUNITY_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
    },
  });

  const exportRows = exportReadingsResult?.data ?? [];

  const anomalyMetrics = useMemo(() => {
    const usageValues = exportRows
      .map((row) => Number(row.WATER_USED))
      .filter((value) => Number.isFinite(value));

    const pricePerGallonValues = exportRows
      .filter((row) => row.WATER_USED > 0)
      .map((row) => row.PRICE / row.WATER_USED)
      .filter((value) => Number.isFinite(value));

    const usageMean =
      usageValues.length > 0
        ? usageValues.reduce((sum, value) => sum + value, 0) / usageValues.length
        : 0;
    const usageVariance =
      usageValues.length > 0
        ? usageValues.reduce((sum, value) => sum + (value - usageMean) ** 2, 0) /
          usageValues.length
        : 0;
    const usageStdDev = Math.sqrt(usageVariance);

    const sortedPricePerGallon = [...pricePerGallonValues].sort((a, b) => a - b);
    const medianPricePerGallon =
      sortedPricePerGallon.length > 0
        ? sortedPricePerGallon[Math.floor(sortedPricePerGallon.length / 2)]
        : 0;

    return {
      usageMean,
      usageStdDev,
      medianPricePerGallon,
    };
  }, [exportRows]);

  const getRowFlags = (row: MeterReadingRow) => {
    const flags: Array<{ label: string; variant: "destructive" | "secondary" }> = [];

    if (row.WATER_USED < 0) {
      flags.push({ label: "Negative usage", variant: "destructive" });
    }

    if (row.WATER_USED === 0) {
      flags.push({ label: "Zero usage", variant: "secondary" });
    }

    if (row.LAST_READING != null && row.CURRENT_READING < row.LAST_READING) {
      flags.push({ label: "Current < last", variant: "destructive" });
    }

    const usageSpikeThreshold = anomalyMetrics.usageMean + anomalyMetrics.usageStdDev * 2;
    if (row.WATER_USED > usageSpikeThreshold && row.WATER_USED > 0) {
      flags.push({ label: "Usage spike", variant: "secondary" });
    }

    if (row.WATER_USED > 0 && anomalyMetrics.medianPricePerGallon > 0) {
      const rowPricePerGallon = row.PRICE / row.WATER_USED;
      if (
        rowPricePerGallon > anomalyMetrics.medianPricePerGallon * 1.75 ||
        rowPricePerGallon < anomalyMetrics.medianPricePerGallon * 0.5
      ) {
        flags.push({ label: "Price anomaly", variant: "secondary" });
      }
    }

    return flags;
  };

  const setQuickPreset = (preset: "today" | "last7" | "thisMonth") => {
    const now = new Date();
    const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

    if (preset === "today") {
      const today = toIsoDate(now);
      setDateFrom(today);
      setDateTo(today);
      setSortBy("date_desc");
      return;
    }

    if (preset === "last7") {
      const from = new Date(now);
      from.setDate(now.getDate() - 6);
      setDateFrom(toIsoDate(from));
      setDateTo(toIsoDate(now));
      setSortBy("date_desc");
      return;
    }

    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    setDateFrom(toIsoDate(from));
    setDateTo(toIsoDate(now));
    setSortBy("date_desc");
  };

  const saveCurrentPreset = () => {
    const name = window.prompt("Preset name");
    if (!name?.trim()) return;

    const newPreset: SavedPreset = {
      id: `${Date.now()}`,
      name: name.trim(),
      communityId: selectedCommunityId,
      meterId: selectedMeterId,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
    };

    savePresetsToStorage([newPreset, ...savedPresets]);
  };

  const applySavedPreset = (preset: SavedPreset) => {
    setSelectedCommunityId(preset.communityId);
    setSelectedMeterId(preset.meterId);
    setDateFrom(preset.dateFrom ?? "");
    setDateTo(preset.dateTo ?? "");
    setSortBy(preset.sortBy);
  };

  const removePreset = (id: string) => {
    savePresetsToStorage(savedPresets.filter((preset) => preset.id !== id));
  };

  const selectedCommunityLabel =
    communityOptions.find((option) => option.value === selectedCommunityId)?.label ?? "All communities";
  const selectedMeterLabel =
    meterOptions.find((option) => option.value === selectedMeterId)?.label ?? "All meters";

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string }> = [];

    if (selectedCommunityId) {
      chips.push({ key: "community", label: `Community: ${selectedCommunityLabel}` });
    }
    if (selectedMeterId) {
      chips.push({ key: "meter", label: `Meter: ${selectedMeterLabel}` });
    }
    if (dateFrom) {
      chips.push({ key: "from", label: `From: ${dateFrom}` });
    }
    if (dateTo) {
      chips.push({ key: "to", label: `To: ${dateTo}` });
    }
    if (sortBy !== "date_desc") {
      chips.push({
        key: "sort",
        label:
          sortBy === "date_asc"
            ? "Sort: Oldest date"
            : sortBy === "usage_desc"
            ? "Sort: Highest usage"
            : sortBy === "price_desc"
            ? "Sort: Highest price"
            : "Sort: Meter ID",
      });
    }

    return chips;
  }, [selectedCommunityId, selectedMeterId, dateFrom, dateTo, sortBy, selectedCommunityLabel, selectedMeterLabel]);

  const clearFilterChip = (key: string) => {
    if (key === "community") {
      setSelectedCommunityId(undefined);
      setSelectedMeterId(undefined);
      return;
    }
    if (key === "meter") {
      setSelectedMeterId(undefined);
      return;
    }
    if (key === "from") {
      setDateFrom("");
      return;
    }
    if (key === "to") {
      setDateTo("");
      return;
    }
    if (key === "sort") {
      setSortBy("date_desc");
    }
  };

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
      "Community ID",
      "Current Reading (gal)",
      "Last Reading (gal)",
      "Water Used (gal)",
      "Price ($)",
      "Current Date",
      "Last Read Date",
    ];

    const lines = [
      ["Report Community", selectedCommunityLabel].map(csvEscape).join(","),
      ["Report Meter", selectedMeterLabel].map(csvEscape).join(","),
      ["From Date", dateFrom || "All"].map(csvEscape).join(","),
      ["To Date", dateTo || "All"].map(csvEscape).join(","),
      ["Sort By", sortBy].map(csvEscape).join(","),
      "",
      headers.map(csvEscape).join(","),
    ];

    for (const row of exportRows) {
      lines.push(
        [
          row.id,
          row.METER_ID,
          row.COMMUNITY_ID,
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

      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

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
      size: 120,
      minSize: 120,
      cell: ({ getValue }) => {
        const id = getValue<number>();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreHorizontal className="mr-1 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => show("METER_READINGS", id)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => edit("METER_READINGS", id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this meter reading?"
                  );

                  if (!confirmed) return;

                  deleteOne({
                    resource: "METER_READINGS",
                    id,
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "flags",
      header: "Flags",
      cell: ({ row }) => {
        const flags = getRowFlags(row.original as MeterReadingRow);

        if (!flags.length) {
          return <span className="text-muted-foreground">Normal</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {flags.map((flag, index) => (
              <Badge key={`${flag.label}-${index}`} variant={flag.variant}>
                {flag.label}
              </Badge>
            ))}
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
      sorters: {
        permanent: permanentSorters,
      },
      meta: {
        select: "id,METER_ID,COMMUNITY_ID,CURRENT_READING,LAST_READING,WATER_USED,PRICE,DATE_CURRENT,DATE_LAST_READ",
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

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
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
                  setDateFrom("");
                  setDateTo("");
                  setSortBy("date_desc");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="space-y-2">
              <p className="text-sm font-medium">From Date</p>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">To Date</p>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Sort By</p>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="date_desc">Newest date first</option>
                <option value="date_asc">Oldest date first</option>
                <option value="usage_desc">Highest water used</option>
                <option value="price_desc">Highest price</option>
                <option value="meter_asc">Meter ID (ascending)</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={() => setQuickPreset("today")}>Today</Button>
              <Button variant="outline" onClick={() => setQuickPreset("last7")}>Last 7 Days</Button>
              <Button variant="outline" onClick={() => setQuickPreset("thisMonth")}>This Month</Button>
            </div>
          </div>

          {activeFilterChips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="gap-1 pr-1">
                  {chip.label}
                  <button
                    type="button"
                    className="rounded-sm p-0.5 hover:bg-muted-foreground/20"
                    onClick={() => clearFilterChip(chip.key)}
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="mb-6 rounded-md border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Saved Filter Presets</p>
          <Button variant="outline" size="sm" onClick={saveCurrentPreset}>
            <Save className="mr-2 h-4 w-4" />
            Save Current
          </Button>
        </div>

        {savedPresets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved presets yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedPresets.map((preset) => (
              <div key={preset.id} className="flex items-center gap-1 rounded-md border px-2 py-1">
                <Button variant="ghost" size="sm" onClick={() => applySavedPreset(preset)}>
                  {preset.name}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removePreset(preset.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DataTable table={table} />
    </div>
  );
};
