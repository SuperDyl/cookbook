import type { Metadata } from "next";
import Layout from "@/components/Layout"
import StyledComponentsRegistry from "@/components/registry";

export const metadata: Metadata = {
  title: `superdyl-cookbook`,
  description: `Upload, share, edit, and print your recipes`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Layout>
            {children}
          </Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
