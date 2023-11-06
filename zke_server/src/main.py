from config import DockerConfig
from gpt_api import GPT_API
from i_ching_models import Diviner

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

import aioredis
from typing import Union

from api_models import APIDivinationStart, APIDivinationConsult
import time

BGINFO = ['姓名赵可儿', '出生地内蒙古包头市', '教育背景中小学完成于包头市', '大学就读吉林艺术学院油画专业', '艺术风格偏好现当代艺术', '艺术品味倾向热抽象', '星座天蝎座', '正义感强', '自尊心高', '童年成长于城乡结合部', '家庭生活复杂', '父亲不热衷赚钱', '母亲情绪易失控', '亲身经历父母激烈争吵', '父亲采用冷处理方式', '对赵可儿影响深刻', '习惯以冷暴力方式应对矛盾', '父亲给予压迫感且固执', '赵可儿渴望自由', '高中数学成绩不佳', '自尊受损', '体验自我怀疑', '同伴和家长压力下学习困难', '采用回避策略面对压力', '大学发现艺术天赋', '自尊得到提升', '建立稳定社交圈', '不缺乏陪伴', '特殊社交模式', '异性社交较少', '人格特点自尊偏高', '习惯性回避压力', '亲密关系采取回避型依恋', '社会支持良好', '心理健康状态稳定', '价值观个人主义明显', '崇尚自由', '反对权威', '重视个人边界', '保持与他人距离', '拒斥威胁和施压', '性格固执', '偶有冷酷表现', '避免深刻连接以自我保护']

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
diviner = Diviner(gptapi)
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
    ai_message, dialog = await diviner.start(data.question, data.hexagram, BGINFO)
    await app.state.redis.set(data.user_id, dialog, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", "0", ex=600)
    await app.state.redis.set(data.user_id + "-HEXAGRAM-", data.hexagram, ex=600)
    
    return {"master": ai_message}


@app.post(cfg('APIROUTE_DIVINATION_CONSULT'))
async def divination_consult(data : APIDivinationConsult):

    if invalid_key(data.key):
        raise CommonERR("invalid_key")
    
    # 计数器 安全检查 确保对话不超过一定长度
    counter = await app.state.redis.get(data.user_id + "-COUNTER-")
    counter = int(counter) if counter else 999
    if counter >= cfg('REDIS_COUNTER'):
        await app.state.redis.delete(data.user_id)
        await app.state.redis.delete(data.user_id + "-COUNTER-")
        await app.state.redis.delete(data.user_id + "-HEXAGRAM-")
        raise CommonERR("rached_consult_limit")

    dialog = await app.state.redis.get(data.user_id)
    hexagram = await app.state.redis.get(data.user_id + "-HEXAGRAM-")
    dialog += data.question
    # 生成卦象 生成说明
    ai_message, dialog = await diviner.consult(data.question, 
                                                  hexagram, 
                                                  dialog,
                                                  BGINFO)

    await app.state.redis.set(data.user_id, dialog, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", counter+1, ex=600)
    await app.state.redis.set(data.user_id + "-HEXAGRAM-", hexagram, ex=600)

    return {"master": ai_message}


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