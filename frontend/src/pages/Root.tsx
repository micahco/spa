import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as auth from "../utils/auth";
import Welcome from "../components/Welcome";
import UserInfo from "../components/UserInfo";

export default function Root() {
	const navigate = useNavigate();

	const handleLogout = () => {
		auth.logout();
		navigate("/");
	};

	return (
		<Show when={auth.isAuthenticated()} fallback={<Welcome />}>
			<nav>
				<button onClick={handleLogout}>Logout</button>
			</nav>
			<h1>Dashboard</h1>
			<UserInfo />
		</Show>
	);
}
