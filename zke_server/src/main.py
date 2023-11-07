from config import DockerConfig
from gpt_api import GPT_API
from i_ching_core import diviner_start, diviner_ask

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

import aioredis
from typing import Union

from api_models import APIDivinationStart, APIDivinationConsult
import time

BGINFO = """赵可儿出生于内蒙古包头市，在当地完成了中小学教育。本科就读于吉林艺术学院，主修油画专业，并对现当代艺术有独特的品味，偏爱热抽象风格。她是一个性格鲜明的天蝎座，从小展现出强烈的正义感和自尊，这些特质延续至成年。赵可儿童年生活在城乡结合部的家庭环境并不和谐，家中经常有争吵，父亲的冷处理方式和固执个性给她留下了深刻印象，促使她极度渴望自由，并在与人冲突时也采取冷暴力。
在高中时期，因数学不佳而成绩下滑的赵可儿遭受了自我怀疑，学习上的压力也促使她形成了逃避策略。然而，大学的艺术专业让她找到了自我价值，重建了自尊，并建立了稳定的社交圈。尽管赵可儿的社交模式独特，限制了她的异性社交，但她并不缺乏社会支持，内心保持健康。
她坚定维护自己的价值观，对金钱和物质有一定的追求，却也不节制花销。她对生活采取随缘态度，不愿被迫做出努力，除非是对个人有意义的事情。这种态度延伸至工作，导致执行力差和拖延。她怀旧，喜欢回忆童年，但对日常事务通常缺乏主见。童年家庭的影响和创伤深刻，她希望得到安抚。她喜欢自我分析，并对紫色情有独钟。"""

BGINFO2 = """
汪文博，一位2002年10月22日出生的男性，身为一名忠诚的属马人士，立足于稳定的中产阶级。他是一个忙碌的父亲，成长在严厉的母亲和童年时期的严格管教下，形成了深刻的应激模式和深沉的恐惧。面对不明确的不确定性和未知的环境，他展现出强烈的好奇心和不屈的好胜心。

尽管有时会受到不稳定的高自尊和轻微的自卑心理的影响，汪文博拥有出色的学习能力、出众的社交技巧和优秀的领导力，这些品质帮助他获得瞬间的优势。他的有力逻辑和独特思维方式，加上坚韧不拔的性格和坚持不懈的决心，使他在学术和人际关系中都表现出色。

他是一个真诚的朋友和爱情中的忠诚伴侣，经历了优异的小学教育和良好的初中生活。他的学习成绩一直很优秀，尤其是在数学和深入研究的物理学领域。这份才华和努力带他进入了一流的高中，尽管面临了高考的压力，他依然被知名的北京大学和著名的香港中文大学录取。

在个人生活方面，他拥有一个美丽的女朋友，但他们的关系并不稳定，曾经历过严重的低谷。尽管如此，汪文博仍然能够深沉地表达内心的情感，他的“爱你”温暖而诚挚，而“想你”充满怀念。他非常关心家人和他熟悉的其他人，展现出他的绝对忠诚和深厚的情感。
"""

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
    ai_message, dialog = await diviner_start(data.question, BGINFO, data.hexagram)
    await app.state.redis.set(data.user_id, dialog, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", "0", ex=600)
    
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
        raise CommonERR("rached_consult_limit")

    dialog = await app.state.redis.get(data.user_id)
    # 生成卦象 生成说明
    ai_message, dialog = await diviner_ask(data.question, 
                                                BGINFO,
                                                dialog)

    await app.state.redis.set(data.user_id, dialog, ex=600)
    await app.state.redis.set(data.user_id + "-COUNTER-", counter+1, ex=600)

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