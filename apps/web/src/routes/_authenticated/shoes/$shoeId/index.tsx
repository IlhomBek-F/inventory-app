import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import { AddMovementDialog } from "./-components/add-movement-dialog";
import { ShoeDetailHeader } from "./-components/shoe-detail-header";
import { ShoeInfoCards } from "./-components/shoe-info-cards";
import { StockMovementTable } from "./-components/stock-movement-table";

export const Route = createFileRoute("/_authenticated/shoes/$shoeId/")({
  loader: async ({ params }) => {
    const [shoe, movements] = await Promise.all([
      api.shoes.get(params.shoeId),
      api.shoes.getMovements(params.shoeId),
    ]);
    return { shoe, movements };
  },
  component: ShoeDetailPage,
});

function ShoeDetailPage() {
  const { shoeId } = Route.useParams();
  const { shoe, movements } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [showMovementDialog, setShowMovementDialog] = useState(false);

  const isLowStock = shoe.quantity <= shoe.minStockAlert;
  const isOutOfStock = shoe.quantity === 0;

  const handleDelete = async () => {
    await api.shoes.delete(shoe.id);
    navigate({ to: "/shoes" });
  };

  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
      <ShoeDetailHeader
        shoe={shoe}
        shoeId={shoeId}
        isOutOfStock={isOutOfStock}
        isLowStock={isLowStock}
        onAddMovement={() => setShowMovementDialog(true)}
        onDelete={handleDelete}
      />

      <ShoeInfoCards shoe={shoe} isOutOfStock={isOutOfStock} isLowStock={isLowStock} />

      <StockMovementTable movements={movements} />

      <AddMovementDialog
        shoeId={shoeId}
        open={showMovementDialog}
        onOpenChange={setShowMovementDialog}
        onSuccess={() => router.invalidate()}
      />
    </div>
  );
}
