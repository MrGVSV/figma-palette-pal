import * as React from "react";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from "react-sortable-hoc";
import Swatch from "./Swatch";
import { HTMLAttributes, useRef } from "react";
import { ColorData } from "./ui";
import "./ui.scss";

declare function require(path: string): any;
const DRAG_HANDLE = require("./icons/drag.svg");

// === The Draggable Handle === //
const Handle = SortableHandle(() => (
	<img src={DRAG_HANDLE} title="Drag to reorder" className="swatch-handle" />
));

// === The Sortable Element === //
const SortableSwatch = SortableElement(
	({ colorName, colors, onSwatchRename, onCopy, shift }) => (
		<li>
			<Handle />
			<Swatch
				swatch={colorName}
				colorData={colors}
				shift={shift}
				onRename={onSwatchRename}
				onCopy={onCopy}
			/>
		</li>
	),
);

// === The Sortable Container === //
interface ISortables extends HTMLAttributes<HTMLElement> {
	swatches: string[];
	colors: ColorData;
	shift: number;
	trash: React.ReactNode
	onSwatchRename?(newName: string, oldName: string): string;
	onCopy?(): void
}
const Sortables = SortableContainer(
	({ swatches, colors, onSwatchRename = () => "", onCopy=() => {}, shift, trash }: ISortables) => {
		return (
			<ul>
				{swatches.map((name, index) => (
					<SortableSwatch
						key={`swatch-${name}`}
						index={index}
						colorName={name}
						colors={colors}
						shift={shift}
						onSwatchRename={onSwatchRename}
						onCopy={onCopy}
					/>
				))}
				{trash}
			</ul>
		);
	},
);

export default Sortables;
