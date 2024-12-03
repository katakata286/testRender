import { handleFiles } from './script.js'

const button = document.getElementById("button-image-upload");
const file_input = document.getElementById("file-input");

button.addEventListener("click", () => {
	file_input.click();
});
	
file_input.addEventListener("change", () => {
	const files = file_input.files;
	handleFiles(files);
		
	file_input.value = "";
});