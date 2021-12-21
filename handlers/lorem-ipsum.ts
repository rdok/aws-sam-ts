import { dolorSit } from "../lib/ioc";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";

export async function handle(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const environmentVariable = await dolorSit.find();
  console.log("Retrieved lorem", environmentVariable);
  return {
    statusCode: 200,
    body: JSON.stringify({ environmentVariable, resource: event.resource }),
  };
}
