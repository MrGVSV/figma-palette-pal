import * as React from "react";

export default function Alert({ text, duration = 1, delay = 0, onRemove }) {
	const alertRef = React.useRef<HTMLDivElement>();

	// === Delete After Duration === //
	React.useEffect(() => {
		function destroy() {
			onRemove && onRemove();
		}
		let timer = window.setTimeout(destroy, duration * 1000 + delay * 1000 - 100);
		return () => {
			window.clearTimeout(timer);
		};
	}, []);
	// /== Delete After Duration === //

	return (
		<div
			ref={alertRef}
			className="swatch-alert"
			style={{
				animationDuration: `${duration}s`,
				animationDelay: `${delay}s`,
			}}>
			<div>{text}</div>
		</div>
	);
}
