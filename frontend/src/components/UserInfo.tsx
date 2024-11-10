import { Show, createResource } from "solid-js";
import api from "../utils/api";

interface Response {
	user: {
		created_at: string;
		email: string;
	};
}

async function fetchData(): Promise<Response> {
	const response = await api.get("users/me");
	return response.json();
}

export default function UserInfo() {
	const [data] = createResource<Response>(fetchData);

	return (
		<Show when={!data.error && data()}>
			<table>
				<tbody>
					<tr>
						<th scope="row">Email</th>
						<td>{data()?.user.email}</td>
					</tr>
					<tr>
						<th scope="row">Created</th>
						<td>
							{new Date(
								data()!.user.created_at
							).toLocaleDateString()}
						</td>
					</tr>
				</tbody>
			</table>
		</Show>
	);
}
