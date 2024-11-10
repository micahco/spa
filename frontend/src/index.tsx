/* @refresh reload */
import "solid-devtools";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { FlashProvider } from "./contexts/FlashProvider";
import Root from "./pages/Root";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import PasswordUpdate from "./pages/PasswordUpdate";
import NotFound from "./pages/NotFound";

render(
	() => (
		<AuthProvider>
			<FlashProvider>
				<Router>
					<Route path="/" component={Root} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<Route path="/password-reset" component={PasswordReset} />
					<Route path="/password-update" component={PasswordUpdate} />
					<Route path="*" component={NotFound} />
				</Router>
			</FlashProvider>
		</AuthProvider>
	),
	document.getElementById("root")!
);
