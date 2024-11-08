import { useNavigate } from "@solidjs/router";
import { isAuthenticated } from "../utils/auth";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Login() {
	const navigate = useNavigate();

	if (isAuthenticated()) {
		navigate("/", { replace: true });
	}

	return (
		<>
			<h1>Welcome</h1>
			<section>
				<h2>Login</h2>
				<LoginForm />
			</section>
			<section>
				<h2>Register</h2>
				<RegisterForm />
			</section>
		</>
	);
}
