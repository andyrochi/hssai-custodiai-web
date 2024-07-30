# %%
import pickle
from flask import Flask, request, render_template, jsonify, make_response, send_file, Response
import os
from flask_cors import CORS, cross_origin
import random
import requests
import pandas as pd
import tempfile
import shutil
import openai
import logging
openai.api_key = os.getenv('OPENAI_KEY')

# %%
# For CORS Protocal
app = Flask(__name__,
            static_folder="../dist/static",
            template_folder="../dist")
CORS(app)
count = 0
# %%
# 配置日志记录
handler = logging.FileHandler('flask_requests.log', encoding='utf-8')
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)  # 确保应用日志记录器级别为 INFO

# 确保根日志记录器的级别也为 INFO
logging.getLogger().setLevel(logging.INFO)
# %%
'''
Interface...
'''
@app.before_request
def log_request_info():
    if request.headers.getlist("X-Forwarded-For"):
        ip = request.headers.getlist("X-Forwarded-For")[0]
    elif request.headers.get("X-Real-IP"):
        ip = request.headers.get("X-Real-IP")
    else:
        ip = request.remote_addr
    app.logger.info('Client IP: %s', ip)
    app.logger.info('Request Headers: %s', request.headers)
    app.logger.info('Request Body: %s', request.get_data(as_text=True))  # 使用 as_text=True 确保请求体以字符串形式获取

@app.after_request
def log_response_info(response):
    app.logger.info('Response Status: %s', response.status)
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    app.logger.info('Processing default request')
    return render_template("index.html")

@app.route('/api/random')
def random_number():
    print('>>>Hi!')
    response = {
        'randomNumber': random.randint(1, 100)
    }
    return jsonify(response)

@app.route('/api/intermediate-vote-monitor', methods=['POST', 'GET'])
def forward_get_bote():
    payload = request.args.to_dict()
    print('>>>payload:', payload)
    external_url = 'http://140.114.80.46:5556/api/vote-monitor'
    response = requests.get(external_url, params=payload)
    return jsonify(response.json())

@app.route('/api/intermediate-vote-download', methods=['POST', 'GET'])
def forward_download():
    payload = request.args.to_dict()
    external_url = 'http://140.114.80.46:5556/api/vote-download'
    external_response = requests.get(external_url, params=payload, stream=True)
    # 确保请求成功
    if external_response.status_code == 200:
        file_size_bytes = len(external_response.content)
        print(f"接收到的文件大小为 {file_size_bytes} 字节", external_response.status_code, external_response.headers)

        return Response(external_response.content, headers={
            "Content-Disposition": "attachment; filename=downloaded_file.csv",
            "Content-Type": "text/csv; charset=utf-8"
        })

        # # 创建临时文件以保存下载的CSV文件
        # with tempfile.NamedTemporaryFile(mode='w+b', delete=False, dir='./') as temp_file:
        #     # 将外部响应的内容写入临时文件
        #     shutil.copyfileobj(external_response.raw, temp_file)
        #     temp_file.flush()  # 确保数据写入磁盘
        #     os.fsync(temp_file.fileno())  # 确保数据从操作系统缓冲区写入
        #     # 注意保留文件名，以便后续使用
        #     temp_file_name = temp_file.name
        #     print("临时文件已创建，路径和文件名为:", temp_file_name)
        
        # # 使用Flask的send_file发送文件
        # # 注意：需要设置as_attachment=True以便于触发浏览器的下载行为
        # return send_file(temp_file_name, as_attachment=True, download_name="downloaded_file.csv", mimetype='text/csv')
    else:
        # 如果外部请求失败，返回错误信息
        return Response("Failed to download file from external URL", status=external_response.status_code)

    return response

def prepare_openai_msg(messages):
    new_messages = [{'role': item['role'], 'content': item['content']} for item in messages]
    return new_messages

@app.route('/api/send-messages', methods=['POST', 'GET'])
def send_messages():
    # 在生成器外部提前获取数据
    app.logger.info('Send Message To OpenAI.')
    payload = request.get_json()
    model = payload['model']
    messages = prepare_openai_msg(payload['messages'])
    stage = payload['stage']
    def stream(model, messages):
        # 使用传入的数据，不依赖请求上下文
        completion = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            stream=True
        )
        for chunk in completion:
            content = chunk.choices[0].delta.get("content", "")
            yield content

    # 将数据传递到生成器函数
    return Response(stream(model, messages), mimetype='text/plain')

@app.route('/api/intermediate-predict', methods=['POST', 'GET'])
def forward_predict():
    payload = request.get_json()
    app.logger.info('Get predict result: %s', payload["model"])
    external_url = 'http://140.114.80.46:5556/api/predict'
    print('>>>payload', payload)
    response = requests.post(external_url, json=payload)
    print('>>>Predict Result:', jsonify(response.json()))
    return jsonify(response.json())

# %%

if __name__ == "__main__":
        port = int(os.environ.get("PORT", 8080))
    #    app.run(host='0.0.0.0', port=port, debug=True, ssl_context=('cert.pem', 'key.pem'))
        app.run(host='0.0.0.0', port=port, debug=True, threaded=True)
