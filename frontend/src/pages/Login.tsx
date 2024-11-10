import { Show, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthProvider";
import LoginForm from "../components/LoginForm";
import FlashMessage from "../components/FlashMessage";
import { useFlash } from "../contexts/FlashProvider";

export default function Login() {
	const navigate = useNavigate();
	const [isAuthenticated] = useAuth();
	const [, pop] = useFlash();

	createEffect(() => {
		if (isAuthenticated()) {
			navigate("/", { replace: true });
		}
	});

	const msg = pop();

	return (
		<>
			<h1>Login</h1>
			<Show when={msg}>
				<FlashMessage>{msg}</FlashMessage>
			</Show>
			<LoginForm />
		</>
	);
}
