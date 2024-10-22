import http from "k6/http";
import { sleep, check } from "k6";

const apiBaseUrl = "http://localhost:8000/api";
const interRequestSleepTime = 0.01;

function generateRandomString() {
  const timestamp = new Date().getTime();
  sleep(0.01);

  return `${timestamp}`;
}

async function getKeyValuePair(key) {
  const response = http.get(`${apiBaseUrl}/data/get/${key}`);

  check(response, {
    "content type JSON": (res) => res.headers["Content-Type"] === "application/json",
  });

  const responseData = response.json();

  return {
    responseStatus: response.status,
    responseData: responseData,
  };
}

async function addKeyValuePair(inputKey = null, inputValue = null) {
  const key = inputKey !== null ? inputKey : generateRandomString();
  const value = inputValue !== null ? inputValue : generateRandomString();

  const requestBody = {
    key: key,
    value: value,
  };
  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(`${apiBaseUrl}/data/add`, JSON.stringify(requestBody), requestParams);

  check(response, {
    "content type JSON": (res) => res.headers["Content-Type"] === "application/json",
  });

  const responseData = response.json();

  return {
    requestData: requestBody,
    responseStatus: response.status,
    responseData: responseData,
  };
}

async function updateKeyValuePair(key, inputValue = null) {
  const value = inputValue !== null ? inputValue : generateRandomString();

  const requestBody = {
    value: value,
  };
  const requestParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.put(`${apiBaseUrl}/data/update/${key}`, JSON.stringify(requestBody), requestParams);

  check(response, {
    "content type JSON": (res) => res.headers["Content-Type"] === "application/json",
  });

  const responseData = response.json();

  return {
    queryData: {
      key: key,
    },
    requestData: requestBody,
    responseStatus: response.status,
    responseData: responseData,
  };
}

async function deleteKeyValuePair(key) {
  const response = http.del(`${apiBaseUrl}/data/delete/${key}`);

  check(response, {
    "content type JSON": (res) => res.headers["Content-Type"] === "application/json",
  });

  const responseData = response.json();

  return {
    responseStatus: response.status,
    responseData: responseData,
  };
}

async function testAddKeyValuePair() {
  const addRandomResult = await addKeyValuePair();
  check(addRandomResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const getResult = await getKeyValuePair(addRandomResult.requestData.key);
  check(getResult, {
    "check response status": (result) => result.responseStatus === 200,
    "check key": (result) => result.responseData.result.key === addRandomResult.requestData.key,
    "check value": (result) => result.responseData.result.value === addRandomResult.requestData.value,
  });
}

async function testUpdateKeyValuePair() {
  const addRandomResult = await addKeyValuePair();
  check(addRandomResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const updateResult = await updateKeyValuePair(addRandomResult.requestData.key);
  check(updateResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const getResult = await getKeyValuePair(addRandomResult.requestData.key);
  check(getResult, {
    "check response status": (result) => result.responseStatus === 200,
    "check get key": (result) => result.responseData.result.key === addRandomResult.requestData.key,
    "check get value": (result) => result.responseData.result.value === updateResult.requestData.value,
  });
}

async function testDeleteKeyValuePair() {
  const addRandomResult = await addKeyValuePair();
  check(addRandomResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const deleteResult = await deleteKeyValuePair(addRandomResult.requestData.key);
  check(deleteResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const getResult = await getKeyValuePair(addRandomResult.requestData.key);
  check(getResult, {
    "check response status": (result) => result.responseStatus === 404,
  });
}

async function testTryGetNonExistentKey() {
  const randomKey = generateRandomString();

  const getResult = await getKeyValuePair(randomKey);
  check(getResult, {
    "check response status": (result) => result.responseStatus === 404,
  });
}

async function testTryAddSameKeyTwice() {
  const addRandomResult = await addKeyValuePair();
  check(addRandomResult, {
    "check response status": (result) => result.responseStatus === 200,
  });

  sleep(interRequestSleepTime);

  const addAgainResult = await addKeyValuePair(addRandomResult.requestData.key);
  check(addAgainResult, {
    "check response status": (result) => result.responseStatus === 400,
  });

  sleep(interRequestSleepTime);

  const getResult = await getKeyValuePair(addRandomResult.requestData.key);
  check(getResult, {
    "check response status": (result) => result.responseStatus === 200,
    "check key": (result) => result.responseData.result.key === addRandomResult.requestData.key,
    "check value": (result) => result.responseData.result.value === addRandomResult.requestData.value,
  });
}

async function testTryUpdateNonExistentKey() {
  const randomKey = generateRandomString();

  const updateResult = await updateKeyValuePair(randomKey);
  check(updateResult, {
    "check response status": (result) => result.responseStatus === 404,
  });
}

async function testTryDeleteNonExistentKey() {
  const randomKey = generateRandomString();

  const updateResult = await deleteKeyValuePair(randomKey);
  check(updateResult, {
    "check response status": (result) => result.responseStatus === 404,
  });
}

export async function testCRUD() {
  await testAddKeyValuePair();

  await testUpdateKeyValuePair();

  await testDeleteKeyValuePair();

  await testTryGetNonExistentKey();

  await testTryAddSameKeyTwice();

  await testTryUpdateNonExistentKey();

  await testTryDeleteNonExistentKey();
}
