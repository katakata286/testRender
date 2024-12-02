import { globalState } from './global_var.js'

const upload_container = document.getElementById("upload-container");
const upload_success_container = document.getElementById("upload-sucess-container");
const button_image_reupload = document.getElementById("button-image-reupload");
const preview = document.getElementById("preview");
	
button_image_reupload.addEventListener("click", () => {
	showUploadContainer();
});

// 處理文件上傳
function handleFiles(files) {
	let validFileFound = false;
	[...files].forEach(file => {
		if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") {
			validFileFound = true;
				
			//const fileTypeDisplay = document.querySelector("#fileTypeDisplay");
			//fileTypeDisplay.textContent = `File format: ${file.type}`;
			previewImg(file);
			
			//uploadFile(file);
		} else {
			alert("Unsupport image format");
		}
	});
	
	if (validFileFound) {
		
		
		const modelWeightsStatusText = document.getElementById('model-weights-status-text');
		/*
		const modelWeightsStatusText = document.getElementById('model-weights-status-text');
		const progressModelWeights = document.getElementById('progress-model-weights');
		// --------------------要改成/tmp/model_weights.pth----------------------
		const filePath = "./model_weights.pth";
		isExist(filePath).then(exists => {
			modelWeightsStatusText.style.display = "block";
			if (exists) {
				modelWeightsStatusText.textContent = "model weights existed";
				modelWeightsStatusText.style.color = "#55B355";
				progressModelWeights.style.display = "none";
			} else {
				modelWeightsStatusText.textContent = "model weights not found";
				modelWeightsStatusText.style.color = "#F55";
				progressModelWeights.style.display = "block";
				downloadModelWeights().then((result) => {
					if (result) {
						modelWeightsStatusText.textContent = "model weights download successfully";
						modelWeightsStatusText.style.color = "#55B355";
					}
				});
			}
		});*/
		
		
		//const previewRect = preview.getBoundingClientRect();
		//const uploadContainerRect = upload_container.getBoundingClientRect();

		// 计算 upload-container 和 preview 的高度差
		//const offset = uploadContainerRect.top - previewRect.top
		//	+ (previewRect.top - uploadContainerRect.bottom) - 20;
			//+ uploadSuccessTextHeight;

		// 设置 preview 的最终位置
		//preview.style.transition = "transform 0.5s ease";
		//preview.style.transform = `translateY(${offset}px)`;

		//upload_container.classList.add("hidden");
		hideUploadContainer();
		
		preview.style.display = "block";
		
		/*
		upload_success_container.style.display = "block";
		setTimeout(() => {
			upload_success_container.classList.add("show");
		}, 1000);
		*/
			
	}
}

function previewImg(file){
	const reader = new FileReader();
		reader.onload = () => {
			const existingImg = preview.querySelector("img");
			if (existingImg) {
				existingImg.src = reader.result;
			}
			else {
				const img = document.createElement("img");
				img.src = reader.result;
				preview.appendChild(img);
				
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const targetSize = 64;
					canvas.width = targetSize;
					canvas.height = targetSize;

					ctx.drawImage(img, 0, 0, targetSize, targetSize);

					const resizedImg = canvas.toDataURL("image/jpeg");
					const resizedImage = new Image();
					resizedImage.src = resizedImg;
					preview.appendChild(resizedImage);
				};
			}
		};
		reader.readAsDataURL(file);
}

function downloadModelWeights() {
	return new Promise((resolve, reject) => {
		const progressBar = document.getElementById('progress-bar');
		const progressLabel = document.getElementById('progress-label');
		
		const eventSource = new EventSource("/download_model_weights");
		
		let isCompleted = false;
		
		eventSource.onmessage = function(event) {
			const data = JSON.parse(event.data);
			const percent = data.percent;

			// 更新進度條
			progressBar.style.width = percent + '%';
			progressLabel.textContent = 'downloading model weights：' + percent + '%';

			// 如果進度達到 100%，關閉連接
			if (percent >= 100 && !isCompleted) {
				isCompleted = true;
				eventSource.close();
				resolve(true);
				
			}
		}
				
		// 發送下載請求
		fetch('/download_model_weights');
	});
}

function isExist(filePath) {
    // 發送 GET 請求，傳遞文件路徑作為查詢參數
    return fetch(`/check_file_exists?file_path=${encodeURIComponent(filePath)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();  // 解析回應的 JSON
        })
        .then(data => {
            if (data.exists) {
                return true;  // 如果文件存在，返回 true
            } else {
                return false;  // 如果文件不存在，返回 false
            }
        })
        .catch(error => {
            console.error("檢查文件時出錯:", error);
            return false;
        });
}

function showUploadContainer() {
	upload_container.style.display = "block";
	setTimeout(() => {
		upload_container.classList.add("show");
	}, 1000); // 动画时长与 CSS 保持一致
}

function hideUploadContainer() {
	upload_container.classList.remove("show");
	setTimeout(() => {
		upload_container.style.display = "none";
	}, 1000); // 动画时长与 CSS 保持一致
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log("Upload successful:", data))
    .catch(error => console.error("Upload error:", error));
}

export { handleFiles, showUploadContainer };



