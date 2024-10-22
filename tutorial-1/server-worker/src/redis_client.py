from os import environ

from redis import Redis


redis_host = "localhost" # environ["REDIS_HOST"]
redis_port = 6379 # environ["REDIS_PORT"]
redis_db = 0 # environ["REDIS_DB"]
redis_password = None # environ.get("REDIS_PASSWORD", None)

redis_client = Redis(host=redis_host, port=redis_port, db=redis_db, password=redis_password, decode_responses=True)
