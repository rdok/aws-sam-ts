import { expect as expectCDK, haveOutput } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";

const app = new App();
const config = new Config();
const stack = new CICDAuthorisationStack(app, "MyTestStack", config);

test("Create output for CI/CD bucket name", () => {
  expectCDK(stack).to(
    haveOutput({
      outputName: "CICDBucketName",
      outputValue: { Ref: "CICDBucket2E34B30B" },
    })
  );
});
