import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ShoeForm, { type ShoeFormData } from "@/components/shoe-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/shoes/new")({
  component: NewShoePage,
});

function NewShoePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ShoeFormData) => {
    setLoading(true);
    try {
      await api.shoes.create(data);
      navigate({ to: "/shoes" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("shoeForm.newTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ShoeForm onSubmit={handleSubmit} loading={loading} submitLabel={t("shoeForm.createShoe")} />
        </CardContent>
      </Card>
    </div>
  );
}
