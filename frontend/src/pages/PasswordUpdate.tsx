import { useSearchParams } from "@solidjs/router";
import PasswordUpdateForm from "../components/PasswordUpdateForm";

export default function PasswordUpdate() {
	const [searchParams] = useSearchParams();

	// Validate token
	if (!searchParams.token) {
		return <div>Missing token</div>;
	}
	if (typeof searchParams.token !== "string") {
		return <div>Invalid token</div>;
	}

	return (
		<>
			<h1>Password Update</h1>
			<PasswordUpdateForm token={searchParams.token} />
		</>
	);
}
