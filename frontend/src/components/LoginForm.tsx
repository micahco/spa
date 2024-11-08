import { Show, createSignal } from "solid-js";
import { HTTPError } from "ky";
import api, { Error, AuthenticationToken } from "../utils/api";
import SubmitButton from "./SubmitButton";
import { login } from "../utils/auth";
import { useNavigate } from "@solidjs/router";

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [errMsg, setErrMsg] = createSignal<string | null>(null);
	const [valErrs, setValErrs] = createSignal<ValidationErrors>({});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setErrMsg(null);
		setValErrs({});
		setIsSubmitting(true);
		try {
			const response = await api.post("tokens/authentication", {
				json: {
					email: email(),
					password: password(),
				},
			});

			const data = await response.json<{
				authentication_token: AuthenticationToken;
			}>();

			login(data.authentication_token);
			navigate("/");
		} catch (err) {
			if (err instanceof HTTPError) {
				const data = await err.response.json<Error>();
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

			<SubmitButton isSubmitting={isSubmitting()} submitMsg={null}>
				Login
			</SubmitButton>

			<Show when={errMsg()}>
				<p class="err">{errMsg()}</p>
			</Show>
		</form>
	);
}
