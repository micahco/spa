import {
	ParentComponent,
	createSignal,
	createContext,
	useContext,
} from "solid-js";

const makeFlashContext = () => {
	const [message, setMessage] = createSignal<string | null>(null);

	const flash = (msg: string) => {
		setMessage(msg);
	};

	const pop = () => {
		const msg = message();
		setMessage(null);
		return msg;
	};

	return [flash, pop] as const;
};

type FlashContextType = ReturnType<typeof makeFlashContext>;

const FlashContext = createContext<FlashContextType>();

export const useFlash = () => {
	const ctx = useContext(FlashContext);
	if (!ctx) {
		throw new Error("useFlash must be used within its FlashProvider");
	}
	return ctx;
};

export const FlashProvider: ParentComponent = (props) => {
	return (
		<FlashContext.Provider value={makeFlashContext()}>
			{props.children}
		</FlashContext.Provider>
	);
};
