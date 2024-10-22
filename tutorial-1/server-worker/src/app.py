from fastapi import FastAPI
from fastapi.responses import JSONResponse

from .models import AddKeyValuePairRequest, UpdateKeyValuePairRequest
from .redis_client import redis_client
from .tasks import delete_key_value_pair, set_key_value_pair


app = FastAPI()


@app.get("/api/data/get/{key}")
def get_key_value_pair_api(key: str):
    """
    Retrieve a key-value pair from the database.

    Args:
        key (str): The key to retrieve the value for.

    Returns:
        JSONResponse: A JSON response containing the key and its corresponding value
            if the key exists in the database. If the key does not exist, returns
            a JSON response with a 404 status code and an error message.
    """

    value = redis_client.get(key)

    if value is None:
        return JSONResponse(status_code=404, content={
            'success': False,
            'error': {
                'message': "Key does not exist.",
            },
        })

    return JSONResponse(status_code=200, content={
        'success': True,
        'result': {
            'key': key,
            'value': value,
        },
    })


@app.post("/api/data/add")
async def add_key_value_pair_api(data: AddKeyValuePairRequest):
    """
    Add a new key-value pair to the database.

    Args:
        data (AddKeyValuePairRequest): The data containing the key and value to add.

    Returns:
        JSONResponse: A JSON response indicating the success or failure of the operation.
            If the key already exists in the database, returns a 400 status code and an
            error message. If the key-value pair addition is scheduled, returns a 200
            status code and a success message.
    """

    if redis_client.exists(data.key):
        return JSONResponse(status_code=400, content={
            'success': False,
            'error': {
                'message': "Key already exists",
            },
        })

    set_key_value_pair(data.key, data.value)

    return JSONResponse(status_code=200, content={
        'success': True,
        'result': {
            'message': "Addition scheduled.",
        },
    })


@app.put("/api/data/update/{key}")
async def set_key_value_pair_api(key: str, data: UpdateKeyValuePairRequest):
    """
    Update the value of an existing key in the database.

    Args:
        key (str): The key to update.
        data (UpdateKeyValuePairRequest): The data containing the new value to set for the key.

    Returns:
        JSONResponse: A JSON response indicating the success or failure of the operation.
            If the key does not exist in the database, returns a 404 status code and an
            error message. If the key-value pair updation is scheduled, returns a 200
            status code and a success message.
    """

    if not redis_client.exists(key):
        return JSONResponse(status_code=404, content={
            'success': False,
            'error': {
                'message': "Key does not exist.",
            },
        })

    set_key_value_pair(key, data.value)

    return JSONResponse(status_code=200, content={
        'success': True,
        'result': {
            'message': "Updation scheduled.",
        },
    })


@app.delete("/api/data/delete/{key}")
async def delete_key_value_pair_api(key: str):
    """
    Delete a key-value pair from the database.

    Args:
        key (str): The key to delete.

    Returns:
        JSONResponse: A JSON response indicating the success or failure of the operation.
            If the key does not exist in the database, returns a 404 status code and an
            error message. If the key-value pair deletion is scheduled, returns a 200
            status code and a success message.
    """

    if not redis_client.exists(key):
        return JSONResponse(status_code=404, content={
            'success': False,
            'error': {
                'message': "Key does not exist.",
            },
        })

    delete_key_value_pair(key)

    return JSONResponse(status_code=200, content={
        'success': True,
        'result': {
            'message': "Deletion scheduled.",
        },
    })
