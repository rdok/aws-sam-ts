import { handle } from "../lorem-ipsum";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { createMock } from "ts-auto-mock";

it("responds with an OK message", async () => {
  const event = createMock<APIGatewayProxyEvent>();

  const response = await handle(event);

  expect(response).toEqual({
    statusCode: 200,
    body: JSON.stringify({
      environmentVariable: "mocked_ac_ligula",
      resource: event.resource,
    }),
  });
});
