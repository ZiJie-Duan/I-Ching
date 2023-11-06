import openai
from pprint import pprint

class GPT_API:
    """
    GPT API Class
    """
    def __init__(self, api_key: str):
        openai.api_key = api_key
        self.model = "gpt-3.5-turbo"  # 设置默认模型

    def set_model(self, model: str):
        """设置模型"""
        self.model = model

    def query(self, 
            messages, 
            temperature = 0.5, 
            max_tokens = 100,
            model = None,
            full = False,
            timeout = 30) -> str:
        
        if not model:
            model = self.model

        response = openai.ChatCompletion.create(
                model = model,
                messages = messages,
                temperature = temperature,
                max_tokens = max_tokens,
                request_timeout = timeout
            )
        if full:
            return response
        else:
            return response.choices[0].message.content


    def query_stream(self, 
            messages, 
            temperature = 0.5, 
            max_tokens = 100,
            model = None,
            full = False,
            timeout = 30) -> str:

        if not model:
            model = self.model
        
        response = openai.ChatCompletion.create(
            model = model,
            messages = messages,
            temperature = temperature,
            max_tokens = max_tokens,
            stream=True,
            request_timeout = timeout
        )

        if full:
            for chunk in response:
                yield chunk
        
        else:
            for chunk in response:
                word = chunk["choices"][0].get("delta", {}).get("content")
                if word:
                    yield word 
    

    async def query_async(self, 
            messages, 
            temperature = 0.5, 
            max_tokens = 100,
            model = None,
            full = False,
            timeout = 10) -> str:
        
        print("\n\n-----------------------")
        pprint(messages)
        
        if not model:
            model = self.model

        finished = False
        for _ in range(3):
            try:
                response = await openai.ChatCompletion.acreate(
                    model = model,
                    messages = messages,
                    temperature = temperature,
                    max_tokens = max_tokens,
                    request_timeout = timeout
                )
                finished = True
                break
            except:
                print("retrying...")
                continue
            
        if not finished:
            raise Exception("GPT API query failed")

        if full:
            return response
        return response.choices[0].message.content