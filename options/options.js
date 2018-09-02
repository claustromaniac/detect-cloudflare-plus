document.addEventListener('DOMContentLoaded', () => {
	browser.storage.sync.get('paEnabled').then((res) => {
		document.querySelector("#paEnabled").checked = res.paEnabled;
	});
});

document.querySelector("form").addEventListener("submit", (e) => {
	browser.storage.sync.set({
		paEnabled: document.querySelector("#paEnabled").checked
	});
	e.preventDefault();
});