from flask import Flask, Response, render_template
import time
import json
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/progress')
def progress():
    def generate():
        total = 100
        for i in range(total):
            time.sleep(0.1)  # 模拟耗时
            yield f"data:{json.dumps({'percent': i + 1})}\n\n"
    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
