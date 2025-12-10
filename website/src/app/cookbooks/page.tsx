"use client"

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { CookbookApiV1 } from "server-api";
import Head from "next/head";
import Link from "next/link";
import { apiBase } from "@/constants";
import type { CookbookStub } from "server-api/build/shared-types";

export default function CookbooksPage() {
  const [cookbooks, setCookbooks] = useState<CookbookStub[] | null>(null);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  useEffect(() => {
    async function fetchCookbookStubs(): Promise<void> {
      try {
        await setCookbooks(await api.getCookbookStubs());
      }
      catch (e: unknown) {
        console.error(e);
      }
    }

    fetchCookbookStubs();
  }, [api]);

  return (
    <>
      <Head>
        <title>Cookbooks-Cookbook</title>
      </Head>
      <Layout>
        <nav>
          <p><Link href="/">Home</Link></p>
          <p><Link href="/cookbook/new">New Cookbook</Link></p>
        </nav>

        <ul>
          {cookbooks?.map(cookbook =>
            <li key={cookbook.id}>
              <Link href={`/cookbook/${cookbook.id}`}>
                {cookbook.title}
              </Link>
            </li>
          )}
        </ul>
      </Layout>
    </>
  );
}
