import { JSX, Show, createEffect, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { isAuthenticated, logout } from "../utils/auth";

interface Props {
	children?: JSX.Element;
}

export default function ProtectedRoute(props: Props) {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = createSignal(false);

	createEffect(() => {
		if (!isAuthenticated()) {
			navigate("/login", { replace: true });
		} else {
			setIsLoggedIn(true);
		}
	});

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<Show when={isLoggedIn()} fallback={<>Authenticating...</>}>
			<nav>
				<button onClick={handleLogout}>Logout</button>
			</nav>
			<main>{props.children}</main>
		</Show>
	);
}
