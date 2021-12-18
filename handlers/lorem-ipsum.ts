import { dolorSit } from "../lib/ioc";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";

export async function handle(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const lorem = await dolorSit.find();
  return {
    statusCode: 200,
    body: JSON.stringify({ lorem, resource: event.resource }),
  };
}
