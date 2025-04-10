import { useCallback, useState } from "react";
import Timeline from "../components/timeline/Timeline";

const HomePage = () => {
	const [refreshKey, setRefreshKey] = useState(0);
	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	const fetchPosts = useCallback(async () => {
		const query = `
			query GetPosts {
				getPosts {
					id
					content
					image
					createdAt
					likes {
      					user {
        					id
      					}
    				}
					author {
						id
						name
						username
					}
				}
			}
		`;

		const res = await fetch(graphqlEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({ query }),
		});

		const result = await res.json();

		console.log("yooooo", result);

		if (result.errors) {
			console.error("GraphQL errors:", result.errors);
			throw new Error(result.errors[0].message);
		}

		return result.data.getPosts;
	}, [refreshKey]);

	return (
		<div className="min-h-screen">
			<Timeline
				title="Home"
				fetchPosts={fetchPosts}
				emptyMessage="No posts to display. Follow some users to see their posts here!"
			/>
		</div>
	);
};

export default HomePage;