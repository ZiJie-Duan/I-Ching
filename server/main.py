from config import DockerConfig
from gpt_api import GPT_API

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import aioredis
from typing import Union

from api_models import APIDivinationStart, APIDivinationConsult


cfg = DockerConfig()
gptapi = GPT_API(cfg('OPENAI_API_KEY'))
app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许来自所有来源的跨域请求
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有的头部信息
)


@app.get(cfg('APIROUTE_DIVINATION_START'))
def read_root(data : APIDivinationStart):

    return {"Hello": "World"}

@app.get(cfg('APIROUTE_DIVINATION_CONSULT'))
def read_item(data : APIDivinationConsult):

    return {"Hello": "World"}


@app.on_event("startup")
async def startup_event():
    # run only once when start up
    print('redis:{}//'.format(cfg('REDIS_HOST')))
    app.state.redis = await aioredis.from_url(
                            'redis://{}'.format(cfg('REDIS_HOST')), 
                            decode_responses=True)
    

@app.on_event("shutdown")
async def shutdown_event():
    # run only once when shutdown
    app.state.redis.close()
    await app.state.redis.wait_closed()

#uvicorn main:app --reload
#http://127.0.0.1:8000/docs

code = await app.state.redis.get(data.email)
await app.state.redis.set(data.email, code, ex=600)
app.state.redis.delete(data.email)