'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  useEffect(
    () => {
      router.replace(`/recipe/${crypto.randomUUID()}`);
    },
    [router]);

  return (
    <p>Redirecting to recipe editor...</p>
  );
}