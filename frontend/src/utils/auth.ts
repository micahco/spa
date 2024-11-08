import { AuthenticationToken } from "./api";

const TOKEN_KEY = "accessToken";
const EXPIRY_KEY = "accessTokenExpiry";

export function isAuthenticated() {
	const token = localStorage.getItem(TOKEN_KEY);
	const expiry = localStorage.getItem(EXPIRY_KEY);

	if (!token || !expiry) return false;

	const exp = new Date(expiry).getTime();
	const now = Date.now();

	return exp > now;
}

export function login(data: AuthenticationToken) {
	localStorage.setItem(TOKEN_KEY, data.token);
	localStorage.setItem(EXPIRY_KEY, data.expiry);
}

export function logout() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(EXPIRY_KEY);
}

export function getAccessToken() {
	return localStorage.getItem(TOKEN_KEY);
}
