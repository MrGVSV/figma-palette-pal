import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.scss";
import { HTMLAttributes, useState, useEffect } from "react";
import Swatch from "./Swatch";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Sortables from "./Sortables";

declare function require(path: string): any;
// Use: <img src={require('./logo.svg')} />
export interface ColorData {
	[key: string]: string
}
interface IMaterialPal extends HTMLAttributes<HTMLElement> {}
const App = () => {
	
	const [colorData, setColorData] = useState({})
	const [swatches, setSwatches] = useState(['Primary', 'Secondary', 'Background', 'Surface'])

	useEffect(() => {
		parent.postMessage(
			{
				pluginMessage: {
					type: 'get-swatches',
				},
			},
			"*",
		);
	}, [])

	window.onmessage = (event: MessageEvent) => {
		let msg = event.data.pluginMessage;
		if (msg.type === "get-color-res") {
			let _cols = {...colorData};
			_cols[msg.data.name] = msg.data.color;
			setColorData(_cols);
		} else if(msg.type === 'get-swatches-res') {
			console.log('got')
			msg.data && setSwatches(msg.data)
		}
	};

	function onSortEnd ({oldIndex, newIndex}) {
		let newSwatches = arrayMove(swatches, oldIndex, newIndex)
		parent.postMessage(
			{
				pluginMessage: {
					type: 'set-swatches',
					data: newSwatches
				},
			},
			"*",
		);
		setSwatches(newSwatches);
		
	};

	function onSwatchRename(newName: string, oldName: string): string {
		let name = newName.trim();

		let index = swatches.indexOf(oldName)

		let count = 1
		while(swatches.includes(name)) {
			name = name + count;
			count++;
		}

		let newSwatches = [...swatches]
		newSwatches[index] = name

		parent.postMessage(
			{
				pluginMessage: {
					type: 'set-swatches',
					data: newSwatches
				},
			},
			"*",
		);

		return name
	}

	useEffect(() => {
		console.log(swatches)
	}, [swatches])

	return (
		<div className="material-pal">
			{/* <Swatch colorName="Primary" colorData={colorData} />
			<Swatch colorName="Secondary" colorData={colorData} />
			<Swatch colorName="Background" colorData={colorData} />
			<Swatch colorName="Surface" colorData={colorData} /> */}
			<Sortables swatches={swatches} colors={colorData} onSwatchRename={onSwatchRename} onSortEnd={onSortEnd} lockAxis='y' helperClass="swatch-drag" />
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("react-page"));
