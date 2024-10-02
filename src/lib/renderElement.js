import { createElement__v2 } from "./createElement__v2.js";
import { setupEventListeners } from "./eventManager";
import { handleUpdateAttributes } from "../utils";

const processVNode = (vNode) => {
	if (vNode === null || vNode === undefined || vNode === "" || typeof vNode === "boolean")
		return "";
	if (typeof vNode === "string" || typeof vNode === "number") return String(vNode);
	if (typeof vNode.type === "function") return processVNode(vNode.type(vNode.props));
	vNode.children = vNode.children.map(processVNode);
	return vNode;
};

const updateAttributes = ($element, newNode, oldNode) => {
	oldNode.props = oldNode.props || {};
	newNode.props = newNode.props || {};

	Object.entries(oldNode.props).forEach(([key, value]) => {
		if (!(key in newNode.props)) {
			handleUpdateAttributes("remove", $element, key, value);
		}
	});

	Object.entries(newNode.props).forEach(([key, value]) => {
		if (!(key in oldNode.props)) {
			handleUpdateAttributes("add", $element, key, value);
		} else {
			handleUpdateAttributes("update", $element, key, value);
		}
	});
};

const updateElement = (newNode, oldNode, $parent, index = 0) => {
	if (!newNode) {
		$parent.removeChild($parent.childNodes[index]);
		return;
	}
	if (!oldNode) {
		$parent.appendChild(createElement__v2(newNode));
		return;
	}
	if (
		(typeof newNode === "number" || typeof newNode === "string") &&
		(typeof oldNode === "number" || typeof oldNode === "string")
	) {
		if (newNode !== oldNode) {
			return $parent.replaceChild(createElement__v2(newNode), $parent.childNodes[index]);
		}
		return;
	}
	if (newNode.type !== oldNode.type) {
		$parent.replaceChild(createElement__v2(newNode), $parent.childNodes[index]);
		return;
	}

	updateAttributes($parent.childNodes[index], newNode, oldNode);

	const newLength = newNode.children.length;
	const oldLength = oldNode.children.length;

	for (let i = 0; i < Math.max(newLength, oldLength); i++) {
		if (i <= newLength) {
			updateElement(newNode.children[i], oldNode.children[i], $parent.childNodes[index], i);
		} else {
			$parent.removeChild($parent.childNodes[index].lastChild);
		}
	}
};

export const renderElement = (vNode, container) => {
	if (!container) return;
	vNode = processVNode(vNode);

	if (!container._vNode) {
		container.appendChild(createElement__v2(vNode));
	} else {
		updateElement(vNode, container._vNode, container);
	}
	container._vNode = vNode;
	setupEventListeners(container);
};
