import ky from "ky";
import { getAccessToken } from "./auth";

export interface Error {
	error: any;
}

export interface AuthenticationToken {
	token: string;
	expiry: string;
}

const api = ky.create({
	prefixUrl: "/api/v1",
	headers: {
		"content-type": "application/json",
	},
	hooks: {
		beforeRequest: [
			(request) => {
				const token = getAccessToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});

export default api;
