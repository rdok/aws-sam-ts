import { Stack } from "@aws-cdk/core";
import { Config } from "../config";
import { Match, Template } from "@aws-cdk/assertions";
import { Effect, Role, User } from "@aws-cdk/aws-iam";
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

test("Authorise monitoring AWS resources", () => {
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

function assertHasPolicyStatement(policyStatement: any) {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([policyStatement]),
    },
  });
}
