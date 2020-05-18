const Color = require("color");
export const HEX_REGEX = /[^0-9a-fA-f]/g;
/**
 * Darken the luminosity of the given color
 *
 * @param hex The hex string (i.e. '#ff00cc')
 * @param amount The amount to adjust by
 */
export function darken(hex: string, amount: number = 0.1): string {
	return adjustColor(hex, -amount);
}

/**
 * Lighten the luminosity of the given color
 *
 * @param hex The hex string (i.e. '#ff00cc')
 * @param amount The amount to adjust by
 */
export function lighten(hex: string, amount: number = 0.1): string {
	return adjustColor(hex, amount);
}

/**
 * Adjust the luminosity of the given color
 *
 * @param hex The hex string (i.e. '#ff00cc')
 * @param amount The amount to adjust by
 */
export function adjustColor(hex: string, amount: number = 0.1): string {
	let color = Color(hex);
	if (amount > 0) {
		color = color.lighten(Math.abs(amount));
	} else {
		color = color.darken(Math.abs(amount));
	}
	return color.hex();
}

/**
 * Normalizes a hex string to be all uppercase, 6-digits, and preceded by a '#'
 * 
 * @param val The hex string to normalize
 */
export function makeHex(val: string): string {
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

/**
 * Returns a random hex color
 */
export function randomColor(): string {
	let color = Color.rgb(
		Math.floor(Math.random() * 255),
		Math.floor(Math.random() * 255),
		Math.floor(Math.random() * 255),
	);
	return color.hex();
}
