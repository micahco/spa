import { Show, createSignal } from "solid-js";
import api, { HTTPError, APIError } from "../utils/api";

interface ValidationErrors {
	email?: string;
	password?: string;
}

export default function RegisterForm() {
	const [email, setEmail] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [submitMsg, setSubmitMsg] = createSignal<string | null>(null);
	const [errMsg, setErrMsg] = createSignal<string | null>(null);
	const [valErrs, setValErrs] = createSignal<ValidationErrors>({});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitMsg("");
		setErrMsg(null);
		setValErrs({});
		try {
			const response = await api.post(
				"tokens/verification/registration",
				{
					json: {
						email: email(),
					},
				}
			);

			const data = await response.json<{
				message: string;
			}>();

			if (data.message && typeof data.message === "string") {
				setSubmitMsg(data.message);
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
				<label for="register-email">Email</label>
				<input
					type="email"
					name="email"
					id="register-email"
					required
					value={email()}
					onInput={(e) => setEmail(e.currentTarget.value)}
				/>
				<Show when={valErrs().email}>
					<span class="err">{valErrs().email}</span>
				</Show>
			</div>

			<button type="submit" disabled={isSubmitting()}>
				Register
			</button>

			<Show when={submitMsg()}>
				<p>{submitMsg()}</p>
			</Show>

			<Show when={errMsg()}>
				<p class="err">{errMsg()}</p>
			</Show>
		</form>
	);
}
