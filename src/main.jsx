/** @jsx createVNode */
import { createRouter, createVNode, renderElement } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { addEvent, registerGlobalEvents } from "./utils";
import { App } from "./App";
import { userStorage } from "./storages";

export const router = createRouter({
	"/": HomePage,
	"/login": () => {
		const { loggedIn } = globalStore.getState();
		if (loggedIn) {
			throw new ForbiddenError();
		}
		return <LoginPage />;
	},
	"/profile": () => {
		const { loggedIn } = globalStore.getState();
		if (!loggedIn) {
			throw new UnauthorizedError();
		}
		return <ProfilePage />;
	},
});

const logout = () => {
	globalStore.setState({ currentUser: null, loggedIn: false });
	router.push("/login");
	userStorage.reset();
};

const handleError = (error) => {
	globalStore.setState({ error });
};

// 초기화 함수
const render = () => {
	const $root = document.querySelector("#root");

	try {
		renderElement(<App targetPage={router.getTarget()} />, $root);
	} catch (error) {
		if (error instanceof ForbiddenError) {
			router.push("/");
			return;
		}
		if (error instanceof UnauthorizedError) {
			router.push("/login");
			return;
		}

		console.error(error);

		// globalStore.setState({ error });
	}
	registerGlobalEvents();
};

const main = () => {
	router.subscribe(render);
	globalStore.subscribe(render);
	window.addEventListener("error", handleError);
	window.addEventListener("unhandledrejection", handleError);

	addEvent("click", "[data-link]", (e) => {
		e.preventDefault();
		router.push(e.target.href.replace(window.location.origin, ""));
	});

	addEvent("click", "#logout", (e) => {
		e.preventDefault();
		logout();
	});

	addEvent("click", "#error-boundary", (e) => {
		e.preventDefault();
		globalStore.setState({ error: null });
	});

	render();
};

main();
