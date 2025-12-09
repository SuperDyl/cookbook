'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCookbookPage() {
  const router = useRouter();

  useEffect(
    () => {
      router.replace(`/cookbook/${crypto.randomUUID()}`);
    },
    [router]);

  return (
    <p>Redirecting to cookbook editor...</p>
  );
}