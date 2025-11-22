import * as React from "react";
import Link from "next/link";
import Head from "next/head";

export default function Custom404() {
	return (
		<>
			<Head>
				<title>Not found</title>
			</Head>
			<p>No page found</p>
			<Link href="/">Go home</Link>
		</>
	);
};
