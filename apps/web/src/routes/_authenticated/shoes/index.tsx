import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type Shoe } from "@/lib/api";
import { ShoeTableRow } from "./-components/shoe-table-row";
import { ShoesToolbar } from "./-components/shoes-toolbar";
import { SortHeader, type SortKey } from "./-components/sort-header";

export const Route = createFileRoute("/_authenticated/shoes/")({
  loader: () => api.shoes.list(),
  component: ShoesListPage,
});

function ShoesListPage() {
  const { items: shoes } = Route.useLoaderData();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = shoes.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.sku ?? "").toLowerCase().includes(q),
    );
    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [shoes, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleDelete = async (shoe: Shoe) => {
    await api.shoes.delete(shoe.id);
    router.invalidate();
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Brand",
      "Category",
      "Size",
      "Color",
      "SKU",
      "Cost",
      "Price",
      "Qty",
      "Condition",
    ];
    const rows = shoes.map((s) => [
      s.name,
      s.brand,
      s.category,
      s.size,
      s.color,
      s.sku,
      s.costPrice,
      s.sellPrice,
      s.quantity,
      s.condition,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shoes-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold">Shoe Inventory</h1>

      <ShoesToolbar search={search} onSearchChange={setSearch} onExportCSV={exportCSV} />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Name" field="name" onSort={toggleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Brand" field="brand" onSort={toggleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Category" field="category" onSort={toggleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Size" field="size" onSort={toggleSort} />
              </TableHead>
              <TableHead>Color</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">
                <SortHeader label="Cost" field="costPrice" onSort={toggleSort} />
              </TableHead>
              <TableHead className="text-right">
                <SortHeader label="Price" field="sellPrice" onSort={toggleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Stock" field="quantity" onSort={toggleSort} />
              </TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-6">
                  No shoes found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((shoe) => (
                <ShoeTableRow key={shoe.id} shoe={shoe} onDelete={handleDelete} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
