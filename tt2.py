# -*- coding: utf-8 -*-
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage, HumanMessage, SystemMessage
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableLambda

BGK = """赵可儿出生于内蒙古包头市，在当地完成了中小学教育。本科就读于吉林艺术学院，主修油画专业，并对现当代艺术有独特的品味，偏爱热抽象风格。她是一个性格鲜明的天蝎座，从小展现出强烈的正义感和自尊，这些特质延续至成年。赵可儿童年生活在城乡结合部的家庭环境并不和谐，家中经常有争吵，父亲的冷处理方式和固执个性给她留下了深刻印象，促使她极度渴望自由，并在与人冲突时也采取冷暴力。
在高中时期，因数学不佳而成绩下滑的赵可儿遭受了自我怀疑，学习上的压力也促使她形成了逃避策略。然而，大学的艺术专业让她找到了自我价值，重建了自尊，并建立了稳定的社交圈。尽管赵可儿的社交模式独特，限制了她的异性社交，但她并不缺乏社会支持，内心保持健康。
她坚定维护自己的价值观，对金钱和物质有一定的追求，却也不节制花销。她对生活采取随缘态度，不愿被迫做出努力，除非是对个人有意义的事情。这种态度延伸至工作，导致执行力差和拖延。她怀旧，喜欢回忆童年，但对日常事务通常缺乏主见。童年家庭的影响和创伤深刻，她希望得到安抚。她喜欢自我分析，并对紫色情有独钟。"""


basic_scenario_pmpt = PromptTemplate.from_template(
"""
重复一遍{text}
""")



gpt4 = ChatOpenAI(openai_api_key="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", model_name = "gpt-4-1106-preview")
gpt3 = ChatOpenAI(openai_api_key="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", model_name = "gpt-3.5-turbo")




full_chain = {"check_res":safeCheck, "question":lambda x:x["text"]} | RunnableLambda(route) | StrOutputParser()

print(full_chain.input_schema.schema())