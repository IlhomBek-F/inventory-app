import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ShoeForm, { type ShoeFormData } from "@/components/shoe-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/shoes/$shoeId/edit")({
  component: EditShoePage,
});

// Mock data — will be replaced with API call
const mockShoe: Partial<ShoeFormData> = {
  name: "Air Max 90",
  brand: "Nike",
  category: "Sneakers",
  size: "42",
  color: "White/Red",
  condition: "New",
  sku: "NK-AM90-42",
  barcode: "1234567890123",
  costPrice: 80,
  sellPrice: 130,
  quantity: 2,
  minStockAlert: 5,
  supplier: "Nike Direct",
  location: "Warehouse A",
  description: "Classic Air Max 90 sneaker.",
};

function EditShoePage() {
  const { shoeId } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_data: ShoeFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/shoes/$shoeId", params: { shoeId } });
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Edit Shoe</CardTitle>
        </CardHeader>
        <CardContent>
          <ShoeForm
            initialData={mockShoe}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Update Shoe"
          />
        </CardContent>
      </Card>
    </div>
  );
}
