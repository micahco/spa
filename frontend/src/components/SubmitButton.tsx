import { JSX, Show, Switch, Match } from "solid-js";

interface Props {
	isSubmitting: boolean;
	submitMsg: string | null;
	children?: JSX.Element;
}

export default function (props: Props) {
	return (
		<>
			<button
				type="submit"
				disabled={props.isSubmitting || props.submitMsg !== null}
			>
				<Switch fallback={props.children}>
					<Match when={props.isSubmitting}>Submitting...</Match>
					<Match when={props.submitMsg !== null}>Submitted</Match>
				</Switch>
			</button>

			<Show when={props.submitMsg}>
				<p>{props.submitMsg}</p>
			</Show>
		</>
	);
}
