from flask import Flask, Response, render_template, request, jsonify
from time import sleep
import requests
import os
import json
from download_model_weights import download_file_progressive

app = Flask(__name__)

DOWNLOAD_URL = "https://drive.usercontent.google.com/download?id=1D78jGRJT9m6B1Apeb2orlKJ_E6AwKEta&export=download&authuser=1&confirm=t&uuid=9e62177b-c911-4f5a-84b5-7b8db598db7e&at=AENtkXYNZGHYeWuWKYb3UJbrKTd9%3A1733146544355"
SAVE_PATH = "./model_weights.pth"

@app.route('/')
def index():
    return render_template('/index.html')  # 指向前端 HTML 文件

@app.route('/download_model_weights')
def progress():
    return Response(download_file_progressive(DOWNLOAD_URL, SAVE_PATH), mimetype='text/event-stream')
    
@app.route('/check_file_exists', methods=['GET'])
def check_file_exists():
    file_path = request.args.get('file_path')
    
    if not file_path:
        return jsonify({'error': 'file_path is required'}), 400  # 如果沒有提供路徑，返回錯誤
    
    if os.path.exists(file_path):  # 檢查文件是否存在
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

if __name__ == '__main__':
    app.run(debug=True)
