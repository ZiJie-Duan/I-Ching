from i_ching_prompt import IChingPrompt
import json

class Diviner:
    def __init__(self, GPT_API) -> None:
        self.GPT_API = GPT_API
        self.prompts = IChingPrompt()
        self.hexagram_meaning = self.prompts.hexagram_meaning

    async def __is_safe(self, question:str)->bool:
        """check if the question is safe to answer"""

        result = await self.GPT_API.query_async(
            self.prompts.safe_check_gptmsg(question),
            temperature = 0.0,
            max_tokens = 200
        )

        if "@YES@" in result:
            return True
        
        return False
    

    async def __get_related_info(self, question:str, bg_info:str = "")->str:
        """get related info from the background info"""

        return await self.GPT_API.query_async(
            self.prompts.summarize_relevant_bg_info_gptmsg(question,bg_info),
            temperature = 0.1, max_tokens = 300)


    async def start(self, question:str, hexagram:str, bg_info:str)->(str, str):
        """start a divination, explanation of the hexagram"""
        # 占卜开始的函数，解卦 + 回复问题
        
        # 生成前置提示，作为system prompt 在GPT的消息列表中的第一位
        prompt_f = self.prompts.qalink_1_identity_scenario()
        if bg_info:
            # 针对用户的背景信息，进行处理，提取与问题相关的信息
            related_info = await self.__get_related_info(question, bg_info)
        else:
            related_info = "无"
        
        # 提问安全检查 防止传入危险的问题
        if not await self.__is_safe(question):
            prompt_b = self.prompts.qalink_2_err_fight_back()
        else:
            # 后提示词 用于解卦
            prompt_b = self.prompts.qalink_2_divination_style(
                        self.hexagram_meaning[hexagram], related_info)

        print(related_info)
        
        # 构建消息列表，org 为原始消息列表，pmpt 为前后提示词加入后的消息列表
        message_org = self.prompts.init_user_only_gptmsg(question)
        message_pmpt = self.prompts.front_back_system_prompt_gptmsg(
                        prompt_f, prompt_b, message_org)

        respond = await self.GPT_API.query_async(message_pmpt, 
                                                 temperature = 0.4,
                                                 max_tokens = 1000,
                                                 model = "gpt-4",
                                                 timeout = 60)
        
        # 将回复加入原始消息列表，不包含前后提示词
        message_org = self.prompts.add_assistant_message_gptmsg(respond,
                                                           message_org)
        return (respond, json.dumps(message_org))


    async def consult(self, question:str, dialogue:str,
                      bg_info:str = "")->(str, str):
        """consult the diviner"""
        # 请示占卜的函数，回复问题
        # 相同的前置 提示词
        prompt_f = self.prompts.qalink_1_identity_scenario()

        if bg_info:
            related_info = await self.__get_related_info(question, bg_info)
        else:
            related_info = "无"

        if not await self.__is_safe(question):
            prompt_b = self.prompts.qalink_2_err_fight_back()
        else:
            # 询问风格的后提示词
            prompt_b = self.prompts.qalink_3_inquiry_style(related_info)

        print(related_info)

        message_org = json.loads(dialogue)
        message_org =self.prompts.add_user_message_gptmsg(question, message_org)
        message_pmpt = self.prompts.front_back_system_prompt_gptmsg(
                        prompt_f, prompt_b, message_org)

        respond = await self.GPT_API.query_async(message_pmpt,
                                                 temperature = 0.4,
                                                 max_tokens = 2000,
                                                 model = "gpt-4",
                                                 timeout = 60)

        message_org = self.prompts.add_assistant_message_gptmsg(respond,
                                                           message_org)
        return (respond, json.dumps(message_org))
    

    