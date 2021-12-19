import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";
import { Template } from "@aws-cdk/assertions";

const app = new App();
const config = new Config();
const stack = new CICDAuthorisationStack(app, "MyTestStack", config);
const template = Template.fromStack(stack);
const CICDStackName = `${config.org}-${config.cicdEnvironment}-${config.name}`;

test("Creates CI/CD bucket", () => {
  template.hasResource("AWS::S3::Bucket", {
    Properties: {
      BucketName: CICDStackName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    },
    UpdateReplacePolicy: "Delete",
    DeletionPolicy: "Delete",
  });
});

test("Creates IAM user", () => {
  template.hasResourceProperties("AWS::IAM::User", { UserName: CICDStackName });
});
