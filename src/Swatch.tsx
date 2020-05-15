import * as React from "react";
import "./ui.scss";
import { useState, useEffect, useLayoutEffect, useRef } from "react";

declare function require(path: string): any;
// Use: <img src={require('./logo.svg')} />

var Color = require("color");
const LOCK_OPEN = require("./icons/lock-open.svg");
const LOCK_CLOSE = require("./icons/lock.svg");

interface ISwatch extends React.HTMLAttributes<HTMLElement> {
	swatch: string;
	colorData: object;
	shift?: number;
	onRename?(newName: string, oldName: string): string
}
export default function Swatch({
	swatch,
	colorData,
	shift = 0.25,
	onRename=()=>''
}: ISwatch) {
	const HEX_REGEX = /[^0-9a-fA-f]/g;
	const [color, setColor] = useState<string>(
		colorData[swatch] || randomColor(),
	);
	const [colorName, setColorName] = useState(swatch);
	const [isLocked, setIsLocked] = useState(false);
	const swatchNameRef = useRef<HTMLInputElement>()

	//    ______ ______ ______ ______ _____ _______
	//   |  ____|  ____|  ____|  ____/ ____|__   __|
	//   | |__  | |__  | |__  | |__ | |       | |
	//   |  __| |  __| |  __| |  __|| |       | |
	//   | |____| |    | |    | |___| |____   | |
	//   |______|_|    |_|    |______\_____|  |_|
	//
	//

	useLayoutEffect(() => {
		get("get-color", {
			name: colorName,
		});
	}, []);

	useEffect(() => {
		console.log(colorName)
	}, [colorName])

	// === Replace Color Placeholder === //
	const inputRef = useRef<HTMLInputElement>();
	useEffect(() => {
		if (color && inputRef.current) {
			inputRef.current.value = color;
			handleSubmit(inputRef.current);
		}
	}, [color]);
	// /== Replace Color Placeholder === //

	useEffect(() => {
		let data = colorData[swatch];
		if (data) {
			setIsLocked(true);
			setColor(data);
		} else {
			setColor(randomColor());
		}
	}, [colorData]);

	useEffect(() => {
		if (isLocked) {
			post("set-color", {
				name: swatchNameRef.current.value || colorName,
				color: color,
			});
		} else {
			post("set-color", {
				name:  swatchNameRef.current.value || colorName,
				color: null,
			});
		}
		console.log(`${swatchNameRef.current.value || colorName} is now ${isLocked ? 'locked' : 'unlocked'}!`)
	}, [isLocked]);

	//    _    _          _   _ _____  _      ______ _____   _____
	//   | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \ / ____|
	//   | |__| |  /  \  |  \| | |  | | |    | |__  | |__) | (___
	//   |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  / \___ \
	//   | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \ ____) |
	//   |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_\_____/
	//
	//

	function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
		e.target.select();
	}

	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		handleSubmit(e.currentTarget);
	}

	function handleSubmit(elt: HTMLInputElement) {
		let val = elt.value.trim();
		if (val.replace(HEX_REGEX, "").length === 0) {
			elt.value = color;
			return;
		}

		val = makeHex(val);

		elt.value = val;
		setColor(val);
	}

	function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleSubmit(e.currentTarget);
		}
	}

	function handleRename(elt: HTMLInputElement) {
		if(elt.value === colorName) {return;}
		let name = onRename(elt.value, colorName) || colorName
		elt.value = name
		setColorName(name)
	}

	function copyCode(txt: string) {
		let txtElt = document.createElement("textarea");
		txtElt.value = txt;
		document.body.appendChild(txtElt);
		txtElt.select();
		document.execCommand("copy");
		txtElt.remove();
	}

	//     _____ ______ _______  _______   ____   _____ _______
	//    / ____|  ____|__   __|/ /  __ \ / __ \ / ____|__   __|
	//   | |  __| |__     | |  / /| |__) | |  | | (___    | |
	//   | | |_ |  __|    | | / / |  ___/| |  | |\___ \   | |
	//   | |__| | |____   | |/ /  | |    | |__| |____) |  | |
	//    \_____|______|  |_/_/   |_|     \____/|_____/   |_|
	//
	//

	function post(type: string, data: object) {
		parent.postMessage(
			{
				pluginMessage: {
					type: type,
					data: data,
				},
			},
			"*",
		);
	}
	function get(type: string, data: object) {
		parent.postMessage(
			{
				pluginMessage: {
					type: type,
					data: data,
				},
			},
			"*",
		);
	}

	//    _    _ _______ _____ _
	//   | |  | |__   __|_   _| |
	//   | |  | |  | |    | | | |
	//   | |  | |  | |    | | | |
	//   | |__| |  | |   _| |_| |____
	//    \____/   |_|  |_____|______|
	//
	//

	/**
	 * Darken the luminosity of the given color
	 *
	 * @param hex The hex string (i.e. '#ff00cc')
	 * @param amount The amount to adjust by
	 */
	function darken(hex: string, amount: number = 0.1): string {
		return adjustColor(hex, -amount);
	}

	/**
	 * Lighten the luminosity of the given color
	 *
	 * @param hex The hex string (i.e. '#ff00cc')
	 * @param amount The amount to adjust by
	 */
	function lighten(hex: string, amount: number = 0.1): string {
		return adjustColor(hex, amount);
	}

	/**
	 * Adjust the luminosity of the given color
	 *
	 * @param hex The hex string (i.e. '#ff00cc')
	 * @param amount The amount to adjust by
	 */
	function adjustColor(hex: string, amount: number = 0.1): string {
		let color = Color(hex);
		if (amount > 0) {
			color = color.lighten(Math.abs(amount));
		} else {
			color = color.darken(Math.abs(amount));
		}
		return color.hex();
	}

	function makeHex(val: string): string {
		// === Copy === //
		let _val = `${val}`;

		// === Remove Extras === //
		_val = _val.replace(HEX_REGEX, "");

		// === Trim Whitespace === //
		_val = _val.trim();

		// === Trim Chars === //
		_val = _val.substr(0, 6);

		// === Min Content === //
		if (_val.length === 0) {
			_val = "f";
		}

		// === Fill === //
		if (_val.length <= 2) {
			_val = _val.repeat(6 / _val.length);
		} else if (_val.length < 6) {
			_val = _val[0].repeat(2) + _val[1].repeat(2) + _val[2].repeat(2);
		}

		// === Set Hex === //
		_val = "#" + _val;

		return _val.toUpperCase();
	}

	function randomColor(): string {
		let color = Color.rgb(
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
		);
		return color.hex();
	}

	return (
		<div>
			<input
				className="swatch-name"
				ref={swatchNameRef}
				disabled={isLocked}
				type="text"
				defaultValue={colorName}
				onBlur={e => {handleRename(e.target)}}
				onKeyDown={e => e.key === 'Enter' && handleRename(e.currentTarget)}
			/>
			<div className="swatch">
				<div
					className="swatch-color swatch-color__dark"
					onClick={(_e) => copyCode(darken(color, shift))}
					style={{ backgroundColor: darken(color, shift) }}
				/>
				<div
					className="swatch-color swatch-color__default"
					onClick={(_e) => copyCode(color)}
					style={{ backgroundColor: color }}
				/>
				<div
					className="swatch-color swatch-color__light"
					onClick={(_e) => copyCode(lighten(color, shift))}
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
					<button onMouseDown={(_e) => {handleRename(swatchNameRef.current);setIsLocked(!isLocked)}}>
					<img
						className="swatch-lock"
						title={`${!isLocked ? "Save" : "Unsave"} this color`}
						src={isLocked ? LOCK_CLOSE : LOCK_OPEN}
					/>
					</button>
				</div>
			</div>
		</div>
	);
}
