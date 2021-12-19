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

test("Authorise minimum AWS SAM cloudformation actions", () => {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
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
          Resource: [
            cloudformationResource(),
            cloudformationResourceTransform(),
          ],
        },
      ]),
    },
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
