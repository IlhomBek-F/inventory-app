import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ShoeForm, { type ShoeFormData } from "@/components/shoe-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/shoes/$shoeId/edit")({
  loader: ({ params }) => api.shoes.get(params.shoeId),
  component: EditShoePage,
});

function EditShoePage() {
  const { shoeId } = Route.useParams();
  const shoe = Route.useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const initialData: Partial<ShoeFormData> = {
    name: shoe.name,
    brand: shoe.brand,
    category: shoe.category,
    size: shoe.size,
    color: shoe.color ?? "",
    condition: shoe.condition ?? "New",
    sku: shoe.sku ?? "",
    barcode: shoe.barcode ?? "",
    costPrice: Number(shoe.costPrice),
    sellPrice: Number(shoe.sellPrice),
    quantity: shoe.quantity,
    minStockAlert: shoe.minStockAlert,
    supplier: shoe.supplier ?? "",
    location: shoe.location ?? "",
    description: shoe.description ?? "",
  };

  const handleSubmit = async (data: ShoeFormData) => {
    setLoading(true);
    try {
      await api.shoes.update(shoeId, data);
      navigate({ to: "/shoes/$shoeId", params: { shoeId } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("shoeForm.editTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ShoeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={t("shoeForm.updateShoe")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
