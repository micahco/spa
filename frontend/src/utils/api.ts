import ky, { HTTPError } from "ky";

export { HTTPError };

export interface APIError {
	error: any;
}

let accessToken = "";

export const setAccessToken = (token: string) => {
	accessToken = token;
};

export const api = ky.create({
	prefixUrl: "/api/v1",
	headers: {
		"content-type": "application/json",
	},
	hooks: {
		beforeRequest: [
			(request) => {
				if (accessToken) {
					request.headers.set(
						"Authorization",
						`Bearer ${accessToken}`
					);
				}
			},
		],
	},
});
