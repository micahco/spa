import { Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth, Token } from "../contexts/AuthProvider";
import { api, HTTPError, APIError } from "../utils/api";

interface Props {
	token: string;
	email: string;
}

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function SignupForm(props: Props) {
	const navigate = useNavigate();
	const [, { login }] = useAuth();
	const [token, setToken] = createSignal(props.token);
	const [email, setEmail] = createSignal(props.email);
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
			const usersResponse = await api.post("users", {
				json: {
					token: token(),
					email: email(),
					password: password(),
				},
			});

			if (usersResponse.status !== 201) {
				throw new Error("something went wrong...");
			}

			const authResponse = await api.post("tokens/authentication", {
				json: {
					email: props.email,
					password: password(),
				},
			});

			const data = await authResponse.json<{
				authentication_token: Token;
			}>();

			login(data.authentication_token);
			navigate("/");
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
			<Show when={!props.token}>
				<div>
					<label for="signup-token">Token</label>
					<input
						type="text"
						name="token"
						id="signup-token"
						required
						value={token()}
						onInput={(e) => setToken(e.currentTarget.value)}
					/>
				</div>
			</Show>

			<div>
				<label for="signup-email">Email</label>
				<input
					type="email"
					name="email"
					id="signup-email"
					required
					value={email()}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
				<Show when={valErrs().email}>
					<span class="err">{valErrs().email}</span>
				</Show>
			</div>

			<div>
				<label for="signup-password">Password</label>
				<input
					type="password"
					name="password"
					id="signup-password"
					required
					value={password()}
					onInput={(e) => setPassword(e.currentTarget.value)}
				/>
				<Show when={valErrs().password}>
					<span class="err">{valErrs().password}</span>
				</Show>
			</div>

			<button type="submit" disabled={isSubmitting()}>
				Signup
			</button>

			<Show when={errMsg()}>
				<p class="err">{errMsg()}</p>
			</Show>
		</form>
	);
}
