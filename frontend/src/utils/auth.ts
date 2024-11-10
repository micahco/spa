import { createStore } from "solid-js/store";
import { createEffect, createSignal } from "solid-js";

export interface Token {
	token: string;
	expiry: string;
}

const TOKEN_KEY = "accessToken";
const EXPIRY_KEY = "accessTokenExpiry";

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
	const expTime = new Date(expiry).getTime();
	setIsAuthenticated(!!token && expTime > now);
});

export { isAuthenticated };

export function login(t: Token) {
	setStore(t);
}

export function logout() {
	setStore({
		token: "",
		expiry: "",
	});
}

export function getAccessToken() {
	return store.token;
}
