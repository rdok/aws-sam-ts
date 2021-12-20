import { Stack } from "@aws-cdk/core";
import { Config } from "../lib/config";
import { Match, Template } from "@aws-cdk/assertions";
import { SamPolicy } from "../lib/sam-policy";

const testStack = new Stack();
const config = new Config();
const stackRegex = `${config.org}-*-${config.name}*`;
const deploymentBucketName = "deploymentBucketName";
new SamPolicy(testStack, { stackRegex, config, deploymentBucketName });
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
    Effect: "Allow",
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
    Effect: "Allow",
    Resource: iamResource(),
  });
});

test("Authorise deployment bucket access", () => {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: ["s3:PutObject", "s3:GetObject"],
          Effect: "Allow",
          Resource: `arn:aws:s3:::${deploymentBucketName}/*`,
        },
      ]),
    },
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
