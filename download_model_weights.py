import requests
import json
from tqdm import tqdm
import os


def download_Objaverse_model_weights():
	# not yet upload model weights to drive
	download_url = ""
	save_path = "/tmp/model_weights_Objaverse.pth"
	download_file(download_url=download_url, save_path=save_path)
	return save_path


def download_MVC_model_weights():
	download_url = "https://drive.usercontent.google.com/download?id=1D78jGRJT9m6B1Apeb2orlKJ_E6AwKEta&export=download&authuser=1&confirm=t&uuid=9e62177b-c911-4f5a-84b5-7b8db598db7e&at=AENtkXYNZGHYeWuWKYb3UJbrKTd9%3A1733146544355"
	save_path = "/tmp/model_weights_MVC.pth"
	download_file(download_url=download_url, save_path=save_path)
	return save_path


def download_file(download_url, save_path):
	with tqdm(total=100, desc="Downloading", unit="%") as pbar:
		for progress in download_file_progressive(download_url, save_path):
			data = json.loads(progress.split("data:")[-1].strip())
			percent = data['percent']
			pbar.update(percent - pbar.n)


def download_file_progressive(download_url, save_path):
	if os.path.exists(save_path):
		yield f"data:{json.dumps({'percent': 100})}\n\n"  # 如果已經存在，設定進度為 100%
		return  # 不再進行下載

	with requests.get(download_url, stream=True) as response:
		total_size = int(response.headers.get('content-length', 0))
		downloaded_size = 0

		with open(save_path, 'wb') as file:
			for chunk in response.iter_content(chunk_size=1024):
				if chunk:
					file.write(chunk)
					downloaded_size += len(chunk)
					percent = int(downloaded_size / total_size * 100)
					yield f"data:{json.dumps({'percent': percent})}\n\n"
