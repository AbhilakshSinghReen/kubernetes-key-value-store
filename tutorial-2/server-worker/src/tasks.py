from os import environ
from time import sleep

from huey import RedisHuey

from .redis_client import redis_client


redis_host = environ["REDIS_HOST"]
debug_set_pair_time_delay = int(environ.get('DEBUG_SET_PAIR_TIME_DELAY', 0))

huey = RedisHuey('entrypoint', host=redis_host)


@huey.task()
def set_key_value_pair(key: str, value: str):
    sleep(debug_set_pair_time_delay)
    redis_client.set(key, value)


@huey.task()
def delete_key_value_pair(key: str):
    sleep(debug_set_pair_time_delay)
    redis_client.delete(key)