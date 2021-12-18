import {
  beASupersetOfTemplate,
  expect as expectCDK,
  haveResource,
  ResourcePart,
} from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";
import { makeCICDBucketTemplate } from "./makers";

const app = new App();
const config = new Config();
const stack = new CICDAuthorisationStack(app, "MyTestStack", config);

test("Creates CI/CD bucket", () => {
  const bucketName = `${config.org}-${config.environments[1]}-${config.name}-19102021`;
  expectCDK(stack).to(
    beASupersetOfTemplate(
      makeCICDBucketTemplate("CICDBucket97E9A4D3", bucketName)
    )
  );
});

test("Creates IAM user", () => {
  const userName = `${config.org}-${config.cicdEnvironment}-${config.name}`;
  expectCDK(stack).to(
    haveResource(
      "AWS::IAM::User",
      { Type: "AWS::IAM::User", Properties: { UserName: userName } },
      ResourcePart.CompleteDefinition
    )
  );
});
