import * as React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import Swatch from "./Swatch";
import { HTMLAttributes } from "react";
import { ColorData } from "./ui";
import "./ui.scss";

declare function require(path: string): any;
const DRAG_HANDLE = require("./icons/drag.svg");

const SortableSwatch = SortableElement(({ colorName, colors, onSwatchRename }) => (
	<li>
		<img
			src={DRAG_HANDLE}
			title="Drag to reorder"
			className="swatch-handle"
		/>
		<Swatch swatch={colorName} colorData={colors} onRename={onSwatchRename} />
	</li>
));

interface ISortables extends HTMLAttributes<HTMLElement> {
	swatches: string[];
	colors: ColorData;
	onSwatchRename?(newName: string, oldName: string): string
}
const Sortables = SortableContainer(({ swatches, colors, onSwatchRename=()=>'' }: ISortables) => {
	return (
		<ul>
			{swatches.map((name, index) => (
				<SortableSwatch
					key={`swatch-${name}`}
					index={index}
					colorName={name}
					colors={colors}
					onSwatchRename={onSwatchRename}
				/>
			))}
		</ul>
	);
});

export default Sortables;
