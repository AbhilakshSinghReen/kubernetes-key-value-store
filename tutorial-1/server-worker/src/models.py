from pydantic import BaseModel


class AddKeyValuePairRequest(BaseModel):
    key: str
    value: str


class UpdateKeyValuePairRequest(BaseModel):
    value: str
