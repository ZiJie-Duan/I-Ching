from pydantic import BaseModel, constr

class APIDivinationStart(BaseModel):
    key : constr(max_length=36, min_length=36)
    user_id : constr(max_length=36, min_length=36)
    hexagram : constr(max_length=6, min_length=6) 
    question : constr(min_length=2, max_length=50)


class APIDivinationConsult(BaseModel):
    key : constr(max_length=36, min_length=36)
    user_id : constr(max_length=36, min_length=36)
    question : constr(min_length=2, max_length=50)