import ky, { HTTPError } from "ky";
import * as auth from "./auth";

export { HTTPError };

export interface APIError {
	error: any;
}

const api = ky.create({
	prefixUrl: "/api/v1",
	headers: {
		"content-type": "application/json",
	},
	hooks: {
		beforeRequest: [
			(request) => {
				const token = auth.getAccessToken();
				if (token) {
					request.headers.set("Authorization", `Bearer ${token}`);
				}
			},
		],
	},
});

export default api;
