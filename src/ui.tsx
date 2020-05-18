import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.scss";
import { useState, useEffect, useRef } from "react";
import { SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import Sortables from "./Sortables";
import { HEX_REGEX, makeHex } from "./Hex";
import Alert from "./Alert";
import nextId from "react-id-generator";
import { post, get } from "./utils";

const Color = require("color");

declare function require(path: string): any;
// Use: <img src={require('./logo.svg')} />

// === Icons === //
const ADD_COLOR = require("./icons/plus-circle.svg");
const SET_BG = require("./icons/bg.svg");
const SHIFT = require("./icons/compare.svg");
const CREDIT = require("./icons/credit-card.svg");
const GITHUB = require("./icons/github.svg");

export interface ColorData {
	[key: string]: string;
}
const App = () => {
	/// Contains {swatchName: color} data
	const [colorData, setColorData] = useState({});
	/// List of the current swatch names
	const [swatches, setSwatches] = useState([
		"Primary",
		"Secondary",
		"Background",
		"Surface",
	]);
	/// True if swatch is being trashed
	const [isTrashing, setIsTrashing] = useState(false);
	/// List of current copy alerts
	const [alerts, setAlerts] = useState([]);
	/// The count to append to new colors
	const [defaultCount, setDefaultCount] = useState(1);
	/// The background color
	const [bg, setBG] = useState("#FFFFFF");
	/// The difference in percent between the 3 swatches
	const [shift, setShift] = useState(0.2);

	//    _____ _   _ _____ _______ _____          _      _____ ____________
	//   |_   _| \ | |_   _|__   __|_   _|   /\   | |    |_   _|___  /  ____|
	//     | | |  \| | | |    | |    | |    /  \  | |      | |    / /| |__
	//     | | | . ` | | |    | |    | |   / /\ \ | |      | |   / / |  __|
	//    _| |_| |\  |_| |_   | |   _| |_ / ____ \| |____ _| |_ / /__| |____
	//   |_____|_| \_|_____|  |_|  |_____/_/    \_\______|_____/_____|______|
	//
	//

	// === Apply Requested User Settings === //
	window.onmessage = (event: MessageEvent) => {
		let msg = event.data.pluginMessage;
		if (msg.type === "get-color-res") {
			let _cols = { ...colorData };
			_cols[msg.data.name] = msg.data.color;
			setColorData(_cols);
		} else if (msg.type === "get-swatches-res") {
			msg.data && setSwatches(msg.data);
		} else if (msg.type === "get-bg-res") {
			msg.data && setBG(msg.data);
		} else if (msg.type === "get-shift-res") {
			msg.data && setShift(msg.data);
		}
	};
	// /== Apply Requested User Settings === //

	// === Request User Settings === //
	useEffect(() => {
		get("get-swatches");
		get("get-bg");
		get("get-shift");
	}, []);
	// /== Request User Settings === //

	//    ________      ________ _   _ _______ _____
	//   |  ____\ \    / /  ____| \ | |__   __/ ____|
	//   | |__   \ \  / /| |__  |  \| |  | | | (___
	//   |  __|   \ \/ / |  __| | . ` |  | |  \___ \
	//   | |____   \  /  | |____| |\  |  | |  ____) |
	//   |______|   \/   |______|_| \_|  |_| |_____/
	//
	//

	/**
	 * Handle re-sort
	 */
	function onSortEnd({ oldIndex, newIndex }) {
		let newSwatches = [];
		if (newIndex >= swatches.length) {
			// === Trash === //
			setIsTrashing(false);
			newSwatches = [...swatches];
			newSwatches.splice(oldIndex, 1);
		} else {
			// === Get Sort === //
			newSwatches = arrayMove(swatches, oldIndex, newIndex);
		}

		// === Save To LocalStorage === //
		post("set-swatches", newSwatches);

		// === Update Swatches === //
		setSwatches(newSwatches);
	}

	/**
	 * Attempts to rename a swatch
	 * @param newName The swatches new name
	 * @param oldName The swatches old name
	 */
	function onSwatchRename(newName: string, oldName: string): string {
		let name = newName.trim();
		let indexToSwap = swatches.indexOf(oldName);

		// === Make Sure Name Is Unique === //
		let _name = name;
		let count = 1;
		while (swatches.includes(_name) || _name.length === 0) {
			_name = `${name} ${count}`;
			count++;
		}

		// === Update Swatches === //
		let newSwatches = [...swatches];
		newSwatches[indexToSwap] = _name;

		// === Save To LocalStorage === //
		post("set-swatches", newSwatches);

		return _name;
	}

	/**
	 *  Handle swatch being dragged
	 */
	function onSortDrag(e) {
		// If drag below trash icon...
		if (e.newIndex >= swatches.length) {
			// === Start Trashing === //
			setIsTrashing(true);
			e.helper.style.filter = "opacity(0.5) grayscale(50%)";
		} else {
			// === End Trashing === //
			setIsTrashing(false);
			e.helper.style.filter = "";
		}
	}

	//     _____ ______ _______ _______ _____ _   _  _____  _____
	//    / ____|  ____|__   __|__   __|_   _| \ | |/ ____|/ ____|
	//   | (___ | |__     | |     | |    | | |  \| | |  __| (___
	//    \___ \|  __|    | |     | |    | | | . ` | | |_ |\___ \
	//    ____) | |____   | |     | |   _| |_| |\  | |__| |____) |
	//   |_____/|______|  |_|     |_|  |_____|_| \_|\_____|_____/
	//
	//

	/**
	 * Add a new color
	 */
	function addColor() {
		let count = defaultCount;
		let name = "Color";

		// === Make Name Unique === //
		while (swatches.includes(name)) {
			name = "Color " + count;
			count++;
		}
		// === Update Default Count === //
		setDefaultCount(count);

		let newSwatches = [...swatches];
		newSwatches.splice(0, 0, name);

		// === Save To LocalStorage === //
		post("set-swatches", newSwatches);

		// === Update Swatches === //
		setSwatches(newSwatches);
	}

	/**
	 * Set the background of the plugin
	 */
	function setBackground(elt: HTMLInputElement) {
		// === Return If Empty === //
		let val = elt.value.trim();
		if (val.replace(HEX_REGEX, "").length === 0) {
			elt.value = bg;
			return;
		}

		// === Sanitize === //
		val = makeHex(val);
		elt.value = val;

		// === Save To LocalStorage === //
		post("set-bg", val);

		// === Update Swatches === //
		setBG(val);
	}

	/**
	 * Change the shift between colors
	 */
	function changeShift(e: React.ChangeEvent<HTMLInputElement>) {
		let elt = e.target as HTMLInputElement;
		let str = elt.value.trim().replace(/[^\d.]/g, "");
		let val = Number(str);

		// === Constrain [0, 1] === //
		if (val < 0) {
			val = 0;
		}
		if (val > 1) {
			val = 1;
		}
		elt.value = `${val}`;

		// === Save To LocalStorage === //
		post("set-shift", val);

		// === Update Swatches === //
		setShift(val);
	}

	/**
	 * Create a new copy alert
	 */
	function copyAlert() {
		let key = nextId();
		let _alerts = [...alerts];
		_alerts.push(
			<Alert
				key={key}
				text="Copied! 🎨"
				duration={2}
				delay={1}
				onRemove={endCopyAlert}
			/>,
		);
		setAlerts(_alerts);
	}

	/**
	 * Remove the alert from the current alerts
	 */
	function endCopyAlert() {
		let _alerts = [...alerts];
		_alerts.shift();
		setAlerts(_alerts);
	}

	//    _____  ______ _   _ _____  ______ _____
	//   |  __ \|  ____| \ | |  __ \|  ____|  __ \
	//   | |__) | |__  |  \| | |  | | |__  | |__) |
	//   |  _  /|  __| | . ` | |  | |  __| |  _  /
	//   | | \ \| |____| |\  | |__| | |____| | \ \
	//   |_|  \_\______|_| \_|_____/|______|_|  \_\
	//
	//

	return (
		<div
			className={`palette-pal ${Color(bg).isDark() && "invert"}`}
			style={{ backgroundColor: bg }}>
			{alerts}
			<div className="controls">
				<img src={SHIFT} alt="Shift luminosity" />
				<span className="swatch-shift">
					<input
						onChange={changeShift}
						type="number"
						min="0"
						max="1"
						step="0.1"
						placeholder={`${shift}`}
						title="Shift the luminosity range"
					/>
				</span>
				<img src={SET_BG} alt="Set the background color" />
				<input
					className="swatch-bg"
					type="text"
					title="Set the background color"
					placeholder={bg}
					onFocus={(e) => e.target.select()}
					onBlur={(e) => setBackground(e.target)}
					onKeyDown={(e) =>
						e.key === "Enter" && setBackground(e.currentTarget)
					}
				/>
				<button onClick={addColor}>
					<img
						src={ADD_COLOR}
						title="Add a new color"
						alt="Add color"
					/>
				</button>
			</div>
			<Sortables
				swatches={swatches}
				colors={colorData}
				shift={shift}
				useWindowAsScrollContainer={true}
				onSwatchRename={onSwatchRename}
				onSortEnd={onSortEnd}
				lockAxis="y"
				helperClass={`swatch-drag ${Color(bg).isDark() && "invert"}`}
				useDragHandle={true}
				onSortOver={onSortDrag}
				onCopy={copyAlert}
				trash={
					<Trash
						isTrashing={isTrashing}
						disabled={true}
						index={swatches.length}
					/>
				}
			/>
			<div className="footer">
				<a target="_parent" href="https://github.com/MrGVSV">
					<img src={GITHUB} alt="Visit my GitHub" />
					<span>&nbsp;Visit my GitHub</span>
				</a>
				<a target="_parent" href="https://www.paypal.me/ginovalente">
					<span>Donate&nbsp;</span>
					<img src={CREDIT} alt="Donate" />
				</a>
			</div>
		</div>
	);
};

const TRASH_CLOSED = require("./icons/delete.svg");
const TRASH_OPEN = require("./icons/delete-empty.svg");
const Trash = SortableElement(({ isTrashing = false }) => (
	<li className="swatch-trash">
		<img
			src={isTrashing ? TRASH_OPEN : TRASH_CLOSED}
			title="Drag palette over to delete"
			alt="Delete icon"
		/>
	</li>
));

ReactDOM.render(<App />, document.getElementById("react-page"));
