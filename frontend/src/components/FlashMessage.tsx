import { JSX } from "solid-js";
import "./FlashMessage.css";

interface Props {
	children?: JSX.Element;
}

export default function FlashMessage(props: Props) {
	return <div class="flash-message">{props.children}</div>;
}
