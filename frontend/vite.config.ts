import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
	plugins: [
		devtools({
			autoname: true,
		}),
		solid(),
	],
	build: {
		outDir: "../ui/frontend",
	},
	server: {
		host: "127.0.0.1",
		proxy: {
			"/api": {
				target: "http://localhost:4000",
				changeOrigin: true,
			},
		},
	},
});
