import { createEffect } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import * as auth from "../utils/auth";
import SignupForm from "../components/SignupForm";

export default function Signup() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	createEffect(() => {
		if (auth.isAuthenticated()) {
			navigate("/", { replace: true });
		}
	});

	let token = "";
	if (searchParams.token && typeof searchParams.token === "string") {
		token = searchParams.token;
	}

	let email = "";
	if (searchParams.email && typeof searchParams.email === "string") {
		email = searchParams.email;
	}

	return (
		<>
			<h1>Signup</h1>
			<SignupForm token={token} email={email} />
		</>
	);
}
