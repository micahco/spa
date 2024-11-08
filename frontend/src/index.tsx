/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

render(
	() => (
		<Router>
			<Route
				path="/"
				component={() => (
					<ProtectedRoute>
						<h1>Hello world</h1>
					</ProtectedRoute>
				)}
			/>
			<Route path="/login" component={Login} />
			<Route path="*" component={NotFound} />
		</Router>
	),
	document.getElementById("root")!
);
