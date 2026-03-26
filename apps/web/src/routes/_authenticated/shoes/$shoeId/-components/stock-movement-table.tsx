import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockMovement } from "@/lib/api";

interface StockMovementTableProps {
  movements: StockMovement[];
}

export function StockMovementTable({ movements }: StockMovementTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Stock Movement History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Type</TableHead>
              <TableHead className="w-20">Qty</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="w-20">User</TableHead>
              <TableHead className="w-24">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <Badge
                    variant={
                      m.type === "in" ? "success" : m.type === "out" ? "destructive" : "warning"
                    }
                  >
                    {m.type === "in" ? "IN" : m.type === "out" ? "OUT" : "ADJ"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={m.type === "in" ? "text-green-600" : "text-red-600"}>
                    {m.type === "in" ? "+" : "-"}
                    {Math.abs(m.quantity)}
                  </span>
                </TableCell>
                <TableCell>{m.reason}</TableCell>
                <TableCell>{m.userId}</TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
