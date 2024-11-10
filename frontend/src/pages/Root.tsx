import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthProvider";
import Welcome from "../components/Welcome";
import UserInfo from "../components/UserInfo";

export default function Root() {
	const navigate = useNavigate();
	const [isAuthenticated, { logout }] = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<Show when={isAuthenticated()} fallback={<Welcome />}>
			<nav>
				<button onClick={handleLogout}>Logout</button>
			</nav>
			<h1>Dashboard</h1>
			<UserInfo />
		</Show>
	);
}
