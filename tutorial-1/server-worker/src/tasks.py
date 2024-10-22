from os import environ

from huey import RedisHuey

from .redis_client import redis_client


redis_host = environ["REDIS_HOST"]

huey = RedisHuey('entrypoint', host=redis_host)


@huey.task()
def set_key_value_pair(key: str, value: str):
    redis_client.set(key, value)


@huey.task()
def delete_key_value_pair(key: str):
    redis_client.delete(key)