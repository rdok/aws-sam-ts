import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";
import { Template } from "@aws-cdk/assertions";

const config = new Config();
const stack = new CICDAuthorisationStack(new App(), "MyTestStack", config);
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

test("Output the CI/CD bucket name", () => {
  const actual = template.findOutputs("CICDBucketName");
  expect(actual.CICDBucketName.Value.Ref).toMatch(/CICDBucket.+/);
});

test("Output the IAM user link", () => {
  const actual = template.findOutputs("CICDIAMUserLink");
  expect(actual.CICDIAMUserLink.Value).toMatchObject({
    "Fn::Join": [
      "",
      [
        "https://console.aws.amazon.com/iam/home?#/users/",
        { Ref: expect.stringMatching(/CICDUser.+/) },
        "?section=security_credentials",
      ],
    ],
  });
});
