from pydantic import BaseModel, constr

class APIDivinationStart(BaseModel):
    key : constr(curtail_length=16)
    user_id : constr(curtail_length=16)
    hexagram : constr(curtail_length=6)
    question : constr(min_length=2, max_length=50)


class APIDivinationConsult(BaseModel):
    key : constr(curtail_length=16)
    user_id : constr(curtail_length=16)
    question : constr(min_length=2, max_length=50)