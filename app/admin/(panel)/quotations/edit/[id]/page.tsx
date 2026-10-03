"use client";

import { use } from "react";
import { QuotationDocForm } from "@/components/admin/QuotationDocForm";

export default function EditQuotationPage({ params }: { params: Promise<unknown> }) {
  const { id } = use(params) as { id: string };
  return <QuotationDocForm id={id} />;
}
