import { Stack } from "@aws-cdk/core";
import { Config } from "../lib/config";
import { Match, Template } from "@aws-cdk/assertions";
import { SamPolicy } from "../lib/sam-policy";
import { Effect, Role, User } from "@aws-cdk/aws-iam";

const testStack = new Stack();
const config = new Config();
const stackRegex = `${config.org}-*-${config.name}*`;
const deploymentBucketName = "deploymentBucketName";
const user = new User(testStack, "CICDUser", { userName: "CICDStackName" });
const role = new Role(testStack, "Role", { assumedBy: user });
new SamPolicy(testStack, { stackRegex, config, deploymentBucketName, role });
const template = Template.fromStack(testStack);

test("Authorise default AWS SAM cloudformation actions", () => {
  assertHasPolicyStatement({
    Action: [
      "cloudformation:CreateChangeSet",
      "cloudformation:GetTemplateSummary",
      "cloudformation:DescribeStacks",
      "cloudformation:DescribeStackEvents",
      "cloudformation:DeleteStack",
      "cloudformation:DescribeChangeSet",
      "cloudformation:ExecuteChangeSet",
    ],
    Effect: Effect.ALLOW,
    Resource: [cloudformationResource(), cloudformationResourceTransform()],
  });
});

test("Authorise default AWS SAM IAM actions", () => {
  assertHasPolicyStatement({
    Action: [
      "iam:AttachRolePolicy",
      "iam:CreateRole",
      "iam:DeleteRole",
      "iam:DeleteRolePolicy",
      "iam:UpdateAssumeRolePolicy",
      "iam:GetRole",
      "iam:UntagRole",
      "iam:ListRoleTags",
      "iam:TagRole",
      "iam:PassRole",
      "iam:DetachRolePolicy",
      "iam:PutRolePolicy",
      "iam:getRolePolicy",
    ],
    Effect: Effect.ALLOW,
    Resource: iamResource(),
  });
});

test("Authorise deployment bucket access", () => {
  assertHasPolicyStatement({
    Action: ["s3:PutObject", "s3:GetObject"],
    Effect: Effect.ALLOW,
    Resource: `arn:aws:s3:::${deploymentBucketName}/*`,
  });
});

test("Authorise IAM policies listing", () => {
  assertHasPolicyStatement({
    Action: "iam:ListPolicies",
    Effect: Effect.ALLOW,
    Resource: "*",
  });
});

function cloudformationResource() {
  return {
    "Fn::Join": [
      "",
      [
        "arn:aws:cloudformation:",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        `:stack/${stackRegex}/*`,
      ],
    ],
  };
}

function iamResource() {
  return {
    "Fn::Join": [
      "",
      ["arn:aws:iam::", { Ref: "AWS::AccountId" }, `:role/${stackRegex}`],
    ],
  };
}

function assertHasPolicyStatement(policyStatement: any) {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([policyStatement]),
    },
  });
}

function cloudformationResourceTransform() {
  return {
    "Fn::Join": [
      "",
      [
        "arn:aws:cloudformation:",
        { Ref: "AWS::Region" },
        ":aws:transform/Serverless-2016-10-31",
      ],
    ],
  };
}
