import { NextFunction, Request, Response } from 'express';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

interface JsonObject {
  [key: string]: JsonValue;
}

interface JsonArray extends Array<JsonValue> {}

const isJsonObject = (value: JsonValue): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const removePrivateData = (data: JsonValue): JsonValue | undefined => {
  if (Array.isArray(data)) {
    return data
      .map(removePrivateData)
      .filter((item): item is JsonValue => item !== undefined);
  } else if (isJsonObject(data)) {
    if (data.isPrivate === true) {
      return undefined;
    }
    const newObj: JsonObject = {};
    for (const [key, value] of Object.entries(data)) {
      const processedValue = removePrivateData(value);
      if (processedValue !== undefined) {
        newObj[key] = processedValue;
      }
    }
    return newObj;
  }
  return data;
};

export const removePrivate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json;
  res.json = function (body: JsonValue): Response {
    console.log('before', body);
    body = removePrivateData(body) as JsonValue;
    console.log('after', body);
    return originalJson.call(this, body);
  };
  next();
};