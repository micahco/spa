import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Welcome() {
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
