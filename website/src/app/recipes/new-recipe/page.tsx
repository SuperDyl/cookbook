"use client"

import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";

export default function NewRecipePage() {

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="/recipes">Go Back</a>
        <ul>
        </ul>
      </Layout>
    </>
  );
}
