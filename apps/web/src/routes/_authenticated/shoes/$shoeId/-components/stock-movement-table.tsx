import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t("shoeDetail.stockHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{t("shoeDetail.movementTable.type")}</TableHead>
              <TableHead className="w-20">{t("shoeDetail.movementTable.qty")}</TableHead>
              <TableHead>{t("shoeDetail.movementTable.reason")}</TableHead>
              <TableHead className="w-20">{t("shoeDetail.movementTable.user")}</TableHead>
              <TableHead className="w-24">{t("shoeDetail.movementTable.date")}</TableHead>
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
                    {m.type === "in"
                      ? t("shoeDetail.movementBadge.in")
                      : m.type === "out"
                        ? t("shoeDetail.movementBadge.out")
                        : t("shoeDetail.movementBadge.adjustment")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={m.type === "in" ? "text-green-600" : "text-red-600"}>
                    {m.type === "in" ? "+" : "-"}
                    {Math.abs(m.quantity)}
                  </span>
                </TableCell>
                <TableCell>{m.reason}</TableCell>
                <TableCell>{m.userName}</TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
