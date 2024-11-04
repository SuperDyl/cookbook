import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";

const NotFoundPage: React.FC<PageProps> = () => {
	return (
		<Layout>
			<p>No page found</p>
			<Link to="/">Go home</Link>
		</Layout>
	);
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
