import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowUpDown, Download, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, type Shoe } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/shoes/")({
  loader: () => api.shoes.list(),
  component: ShoesListPage,
});

type SortKey = "name" | "brand" | "category" | "size" | "costPrice" | "sellPrice" | "quantity";

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
    if (!confirm(`Delete "${shoe.name}"?`)) return;
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

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
      onClick={() => toggleSort(field)}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </Button>
  );

  return (
    <div className="flex flex-col gap-3 max-w-6xl mx-auto">
      <h1 className="text-lg font-bold">Shoe Inventory</h1>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Link to="/shoes/new">
            <Button size="sm">
              <Plus className="size-3.5" />
              Add Shoe
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shoes..."
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Name" field="name" />
              </TableHead>
              <TableHead>
                <SortHeader label="Brand" field="brand" />
              </TableHead>
              <TableHead>
                <SortHeader label="Category" field="category" />
              </TableHead>
              <TableHead>
                <SortHeader label="Size" field="size" />
              </TableHead>
              <TableHead>Color</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">
                <SortHeader label="Cost" field="costPrice" />
              </TableHead>
              <TableHead className="text-right">
                <SortHeader label="Price" field="sellPrice" />
              </TableHead>
              <TableHead>
                <SortHeader label="Stock" field="quantity" />
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
              filtered.map((shoe) => {
                const isLow = shoe.quantity <= shoe.minStockAlert;
                const isOut = shoe.quantity === 0;

                return (
                  <TableRow key={shoe.id}>
                    <TableCell className="font-medium">{shoe.name}</TableCell>
                    <TableCell>{shoe.brand}</TableCell>
                    <TableCell>{shoe.category}</TableCell>
                    <TableCell>{shoe.size}</TableCell>
                    <TableCell>{shoe.color}</TableCell>
                    <TableCell className="text-muted-foreground">{shoe.sku}</TableCell>
                    <TableCell className="text-right">${shoe.costPrice}</TableCell>
                    <TableCell className="text-right">${shoe.sellPrice}</TableCell>
                    <TableCell>
                      <Badge variant={isOut ? "destructive" : isLow ? "warning" : "success"}>
                        {isOut ? "Out" : isLow ? `Low (${shoe.quantity})` : shoe.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Link to="/shoes/$shoeId" params={{ shoeId: shoe.id }}>
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="size-3.5" />
                          </Button>
                        </Link>
                        <Link to="/shoes/$shoeId/edit" params={{ shoeId: shoe.id }}>
                          <Button variant="ghost" size="icon-sm">
                            <Pencil className="size-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(shoe)}>
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
