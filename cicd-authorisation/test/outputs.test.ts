import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";
import { Template } from "@aws-cdk/assertions";

const app = new App();
const config = new Config();
const stack = new CICDAuthorisationStack(app, "MyTestStack", config);
const template = Template.fromStack(stack);

test("Create output for CI/CD bucket name", () => {
  const actual = template.findOutputs("CICDBucketName");
  expect(actual.CICDBucketName.Value.Ref).toMatch(/CICDBucket.+/);
});
