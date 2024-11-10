import { createStore } from "solid-js/store";

const [store, setStore] = createStore({ message: "" });

export function set(message: string) {
	setStore({ message });
}

export function pop(): string {
	const message = store.message;
	setStore({ message: "" });
	return message;
}
