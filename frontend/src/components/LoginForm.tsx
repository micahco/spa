import { Show, createSignal } from "solid-js";
import { useAuth, Token } from "../contexts/AuthProvider";
import { api, HTTPError, APIError } from "../utils/api";
import { A } from "@solidjs/router";

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function LoginForm() {
	const [, { login, logout }] = useAuth();
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [errMsg, setErrMsg] = createSignal<string | null>(null);
	const [valErrs, setValErrs] = createSignal<ValidationErrors>({});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrMsg(null);
		setValErrs({});
		try {
			logout();

			const response = await api.post("tokens/authentication", {
				json: {
					email: email(),
					password: password(),
				},
			});

			const data = await response.json<{
				authentication_token: Token;
			}>();

			login(data.authentication_token);
		} catch (err) {
			if (err instanceof HTTPError) {
				const data = await err.response.json<APIError>();
				if (err.response.status === 422) {
					setValErrs(data.error);
				}
				if (typeof data.error === "string") {
					setErrMsg(data.error);
				}
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label for="login-email">Email</label>
				<input
					type="email"
					name="email"
					id="login-email"
					required
					value={email()}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
				<Show when={valErrs().email}>
					<span class="err">{valErrs().email}</span>
				</Show>
			</div>

			<div>
				<label for="login-password">Password</label>
				<input
					type="password"
					name="password"
					id="login-password"
					required
					value={password()}
					onInput={(e) => setPassword(e.currentTarget.value)}
				/>
				<Show when={valErrs().password}>
					<span class="err">{valErrs().password}</span>
				</Show>
			</div>

			<button type="submit" disabled={isSubmitting()}>
				Login
			</button>

			<A href="/password-reset">Forgot password?</A>

			<Show when={errMsg()}>
				<p class="err">{errMsg()}</p>
			</Show>
		</form>
	);
}
