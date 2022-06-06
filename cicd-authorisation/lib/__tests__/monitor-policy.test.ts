import { Stack } from "aws-cdk-lib";
import { Config } from "../config";
import { Match, Template } from "aws-cdk-lib/assertions";
import { Effect, Role, User } from "aws-cdk-lib/aws-iam";
import { MonitorPolicy } from "../monitor-policy";

const testStack = new Stack();
const config = new Config();
const stackRegex = `${config.org}-*-${config.name}*`;
const user = new User(testStack, "CICDUser", { userName: "CICDStackName" });
const role = new Role(testStack, "Role", { assumedBy: user });
new MonitorPolicy(testStack, {
  stackRegex,
  config,
  role,
});
const template = Template.fromStack(testStack);

test("Authorise SNS monitoring AWS resources", () => {
  assertHasPolicyStatement({
    Action: ["SNS:CreateTopic", "SNS:GetTopicAttributes", "SNS:DeleteTopic"],
    Effect: Effect.ALLOW,
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:aws:sns:",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          `:${stackRegex}`,
        ],
      ],
    },
  });
});

test("Authorise CloudWatch monitoring AWS resources", () => {
  assertHasPolicyStatement({
    Action: ["cloudwatch:PutMetricAlarm", "cloudwatch:DeleteAlarms"],
    Effect: Effect.ALLOW,
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:aws:cloudwatch:",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          `:alarm:${stackRegex}`,
        ],
      ],
    },
  });
});

function assertHasPolicyStatement(policyStatement: any) {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([policyStatement]),
    },
  });
}
