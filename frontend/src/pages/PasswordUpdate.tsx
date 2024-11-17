import { useSearchParams } from "@solidjs/router";
import PasswordUpdateForm from "../components/PasswordUpdateForm";

export default function PasswordUpdate() {
	const [searchParams] = useSearchParams();

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
			<h1>Password Update</h1>
			<PasswordUpdateForm token={token} email={email} />
		</>
	);
}
