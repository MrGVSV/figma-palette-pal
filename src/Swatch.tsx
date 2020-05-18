import * as React from "react";
import "./ui.scss";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import { randomColor, makeHex, HEX_REGEX, darken, lighten } from "./Hex";
import { get, post } from "./utils";

declare function require(path: string): any;

// === Icons === //
const LOCK_OPEN = require("./icons/lock-open.svg");
const LOCK_CLOSE = require("./icons/lock.svg");
const PALETTE = require("./icons/palette.svg");

// === Swatch === //
interface ISwatch extends React.HTMLAttributes<HTMLElement> {
	swatch: string;
	colorData: object;
	shift?: number;
	onRename?(newName: string, oldName: string): string;
	onCopy?(): void;
}
export default function Swatch({
	swatch,
	colorData,
	shift = 0.25,
	onRename = () => "",
	onCopy = () => {},
}: ISwatch) {
	const [color, setColor] = useState<string>(
		colorData[swatch] || randomColor(),
	);
	const [colorName, setColorName] = useState(swatch);
	const [isLocked, setIsLocked] = useState(false);
	const [showPicker, setShowPicker] = useState(false);
	const swatchNameRef = useRef<HTMLInputElement>();

	//    ______ ______ ______ ______ _____ _______
	//   |  ____|  ____|  ____|  ____/ ____|__   __|
	//   | |__  | |__  | |__  | |__ | |       | |
	//   |  __| |  __| |  __| |  __|| |       | |
	//   | |____| |    | |    | |___| |____   | |
	//   |______|_|    |_|    |______\_____|  |_|
	//
	//

	// === Retrieve Color Info === //
	useLayoutEffect(() => {
		get("get-color", {
			name: colorName,
		});
	}, []);
	// /== Retrieve Color Info === //

	// === Replace Color Placeholder === //
	const inputRef = useRef<HTMLInputElement>();
	useEffect(() => {
		if (color && inputRef.current) {
			inputRef.current.value = color;
			handleSubmit(inputRef.current);
		}
	}, [color]);
	// /== Replace Color Placeholder === //

	// === Set Color On Load === //
	useEffect(() => {
		let data = colorData[swatch];
		if (data) {
			setIsLocked(true);
			setColor(data);
		}
	}, [colorData]);
	// /== Set Color On Load === //

	// === Post Color Value On Lock === //
	useEffect(() => {
		if (isLocked) {
			post("set-color", {
				name: swatchNameRef.current.value || colorName,
				color: color,
			});
		} else {
			post("set-color", {
				name: swatchNameRef.current.value || colorName,
				color: null,
			});
		}
	}, [isLocked]);
	// /== Post Color Value On Lock === //

	//    _    _          _   _ _____  _      ______ _____   _____
	//   | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \ / ____|
	//   | |__| |  /  \  |  \| | |  | | |    | |__  | |__) | (___
	//   |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  / \___ \
	//   | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \ ____) |
	//   |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_\_____/
	//
	//

	/// Selects the entire input on focus
	function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
		e.currentTarget.select();
	}

	/// Attempts input validation on blur
	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		handleSubmit(e.currentTarget);
	}

	/// Attempts input validation on 'Enter'
	function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleSubmit(e.currentTarget);
		}
	}

	/// Validate the input as a hex color code
	function handleSubmit(elt: HTMLInputElement) {
		let val = elt.value.trim();

		// === Cannot Be Empty === //
		if (val.replace(HEX_REGEX, "").length === 0) {
			elt.value = color;
			return;
		}

		// === Sanitize Input === //
		val = makeHex(val);
		elt.value = val;

		// === Set Color === //
		setColor(val);
	}

	/// Handles swatch renaming
	function handleRename(elt: HTMLInputElement) {
		if (elt.value === colorName) {
			return;
		}
		let name = onRename(elt.value, colorName) || colorName;
		elt.value = name;
		setColorName(name);
	}

	/**
	 * Copy the given hex color to the clipboard
	 *
	 * @param txt The hex color
	 */
	function copyCode(txt: string) {
		let txtElt = document.createElement("textarea");
		txtElt.value = txt;
		document.body.appendChild(txtElt);
		txtElt.select();
		document.execCommand("copy");
		txtElt.remove();
		onCopy && onCopy();
	}

	//    _____  ______ _   _ ______ _____
	//   |  __ \|  ____| \ | |  ____|  __ \
	//   | |__) | |__  |  \| | |__  | |__) |
	//   |  _  /|  __| | . ` |  __| |  _  /
	//   | | \ \| |____| |\  | |____| | \ \
	//   |_|  \_\______|_| \_|______|_|  \_\
	//
	//

	return (
		<div>
			<input
				className="swatch-name"
				ref={swatchNameRef}
				disabled={isLocked}
				type="text"
				defaultValue={colorName}
				onBlur={(e) => {
					handleRename(e.target);
				}}
				onKeyDown={(e) =>
					e.key === "Enter" && handleRename(e.currentTarget)
				}
			/>
			<div className="swatch">
				<div
					className="swatch-color swatch-color__dark"
					onClick={(_e) => {
						copyCode(darken(color, shift));
					}}
					style={{ backgroundColor: darken(color, shift) }}
				/>
				<div
					className="swatch-color swatch-color__default"
					onClick={(_e) => {
						copyCode(color);
					}}
					style={{ backgroundColor: color }}
				/>
				<div
					className="swatch-color swatch-color__light"
					onClick={(_e) => {
						copyCode(lighten(color, shift));
					}}
					style={{ backgroundColor: lighten(color, shift) }}
				/>
				<div className="swatch-control">
					<input
						disabled={isLocked}
						ref={inputRef}
						type="text"
						placeholder={color}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyDown={handleKey}
					/>
					<button
						onMouseDown={(_e) => {
							setShowPicker(!showPicker);
						}}>
						<img
							className="swatch-picker"
							title={`Toggle the color picker`}
							src={PALETTE}
						/>
					</button>
					<button
						onMouseDown={(_e) => {
							handleRename(swatchNameRef.current);
							setIsLocked(!isLocked);
						}}>
						<img
							className="swatch-lock"
							title={`${
								!isLocked ? "Save" : "Unsave"
							} this color`}
							src={isLocked ? LOCK_CLOSE : LOCK_OPEN}
						/>
					</button>
				</div>
			</div>
			{showPicker && (
				<ChromePicker
					color={color}
					onChange={(e) => !isLocked && setColor(e.hex)}
					disableAlpha={true}
				/>
			)}
		</div>
	);
}
