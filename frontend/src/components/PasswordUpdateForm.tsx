import { Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import api, { HTTPError, APIError } from "../utils/api";
import * as auth from "../utils/auth";
import * as flash from "../utils/flash";

interface Props {
	token: string;
}

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function PasswordUpdateForm(props: Props) {
	const navigate = useNavigate();
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
			const response = await api.put("users/password ", {
				json: {
					email: email(),
					password: password(),
					token: props.token,
				},
			});

			const data = await response.json<{
				message: string;
			}>();

			if (data.message && typeof data.message === "string") {
				auth.logout();
				flash.set(data.message);
				navigate("/login");
			} else {
				throw new Error("something went wrong");
			}
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
				<label for="password-update-email">Email</label>
				<input
					type="email"
					name="email"
					id="password-update-email"
					required
					value={email()}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
				<Show when={valErrs().email}>
					<span class="err">{valErrs().email}</span>
				</Show>
			</div>

			<div>
				<label for="password-update-password">Password</label>
				<input
					type="password"
					name="password"
					id="password-update-password"
					required
					value={password()}
					onInput={(e) => setPassword(e.currentTarget.value)}
				/>
				<Show when={valErrs().password}>
					<span class="err">{valErrs().password}</span>
				</Show>
			</div>

			<button type="submit" disabled={isSubmitting()}>
				Update Password
			</button>

			<Show when={errMsg()}>
				<p class="err">{errMsg()}</p>
			</Show>
		</form>
	);
}
