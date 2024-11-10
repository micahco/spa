import { Show, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as auth from "../utils/auth";
import * as flash from "../utils/flash";
import LoginForm from "../components/LoginForm";
import FlashMessage from "../components/FlashMessage";

export default function Login() {
	const navigate = useNavigate();

	createEffect(() => {
		if (auth.isAuthenticated()) {
			navigate("/", { replace: true });
		}
	});

	const msg = flash.pop();

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
