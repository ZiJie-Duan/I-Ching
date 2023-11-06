from config import DockerConfig
from gpt_api import GPT_API

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

import aioredis
from typing import Union

from api_models import APIDivinationStart, APIDivinationConsult
import time

@asynccontextmanager
async def lifespan(app: FastAPI):

    # run only once when start up
    print('redis:{}//'.format(cfg('REDIS_HOST')))
    app.state.redis = await aioredis.from_url(
                            'redis://{}'.format(cfg('REDIS_HOST')), 
                            decode_responses=True)
    
    yield

    # run only once when shutdown
    app.state.redis.close()
    await app.state.redis.wait_closed()


cfg = DockerConfig()
gptapi = GPT_API(cfg('OPENAI_API_KEY'))
app = FastAPI(lifespan=lifespan)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许来自所有来源的跨域请求
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有的头部信息
)

def invalid_key(key: str) -> bool:
    """
    验证key是否有效, 无效返回True
    """
    if key == cfg('APIKEY_KEY'):
        return False
    else:
        return True
    

@app.post(cfg('APIROUTE_DIVINATION_START'))
async def divination_start(data : APIDivinationStart):

    if invalid_key(data.key):
        raise CommonERR("invalid_key")

    # 生成卦象 生成说明
    ai_reply = "这是一段测试文本，代表占卜师的卦象解释。"
    back_ground = "这是一段背景信息，用于压缩对话内容"
    await app.state.redis.set(data.user_id, back_ground, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", "0", ex=600)
    
    time.sleep(2)
    return {"master": ai_reply}


@app.post(cfg('APIROUTE_DIVINATION_CONSULT'))
async def divination_consult(data : APIDivinationConsult):

    if invalid_key(data.key):
        raise CommonERR("invalid_key")
    
    # 计数器 安全检查 确保对话不超过一定长度
    counter = await app.state.redis.get(data.user_id + "-COUNTER-")
    counter = int(counter) if counter else 999
    if counter >= cfg('REDIS_COUNTER'):
        await app.state.redis.delete(data.user_id)
        raise CommonERR("rached_consult_limit")
        
    # 生成卦象 生成说明
    ai_reply = "这是一段测试文本，代表占卜师对启示的解答。" + data.question
    back_ground = await app.state.redis.get(data.user_id)
    back_ground += data.question

    await app.state.redis.set(data.user_id, back_ground, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", counter+1, ex=600)

    time.sleep(2)
    return {"master": ai_reply}


class CommonERR(Exception):
    """
    一些常见的错误，比如用户名已经存在，邮箱已经存在等
    """
    pass

@app.exception_handler(CommonERR)
async def assert_error_handler(request: Request, exc: CommonERR):
    # standard error response
    return JSONResponse(
        status_code=400,
        content={"detail":[str(exc)]},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,
                                       exc: RequestValidationError):
    # validation error response
    errors = []
    for error in exc.errors():
        detail = error.get("msg")
        # 使用列表推导式确保loc中的每个元素都是字符串
        field = "->".join(str(loc) for loc in error.get("loc", []))
        errors.append(f"{field}: {detail}")
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )


#uvicorn main:app --reload
#http://127.0.0.1:8000/docs

# code = await app.state.redis.get(data.email)
# await app.state.redis.set(data.email, code, ex=600)
# app.state.redis.delete(data.email)