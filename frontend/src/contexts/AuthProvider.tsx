import {
	ParentComponent,
	createEffect,
	createSignal,
	createContext,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { setAccessToken } from "../utils/api";

export interface Token {
	token: string;
	expiry: string;
}

const TOKEN_KEY = "accessToken";
const EXPIRY_KEY = "accessTokenExpiry";

const makeAuthContext = () => {
	const [isAuthenticated, setIsAuthenticated] = createSignal(false);
	const [store, setStore] = createStore<Token>({
		token: localStorage.getItem(TOKEN_KEY) || "",
		expiry: localStorage.getItem(EXPIRY_KEY) || "",
	});

	createEffect(() => {
		const { token, expiry } = store;

		if (token && expiry) {
			localStorage.setItem(TOKEN_KEY, token);
			localStorage.setItem(EXPIRY_KEY, expiry);
		} else {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(EXPIRY_KEY);
		}

		const now = Date.now();
		const exp = new Date(expiry).getTime();
		setIsAuthenticated(Boolean(token) && exp > now);

		setAccessToken(store.token);
	});

	return [
		isAuthenticated,
		{
			login(t: Token) {
				setStore(t);
			},
			logout() {
				setStore({
					token: "",
					expiry: "",
				});
			},
		},
	] as const;
};

type AuthContextType = ReturnType<typeof makeAuthContext>;

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return ctx;
};

export const AuthProvider: ParentComponent = (props) => {
	return (
		<AuthContext.Provider value={makeAuthContext()}>
			{props.children}
		</AuthContext.Provider>
	);
};
