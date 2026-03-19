import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ShoeForm, { type ShoeFormData } from "@/components/shoe-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/shoes/new")({
  component: NewShoePage,
});

function NewShoePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_data: ShoeFormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/shoes" });
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add New Shoe</CardTitle>
        </CardHeader>
        <CardContent>
          <ShoeForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Shoe" />
        </CardContent>
      </Card>
    </div>
  );
}
