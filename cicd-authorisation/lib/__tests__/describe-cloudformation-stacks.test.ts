import { Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { User } from "aws-cdk-lib/aws-iam";
import { Config } from "../config";
import { DescribeCloudformationStacks } from "../describe-cloudformation-stacks";

const config = new Config();
const stack = new Stack();
const stackRegex = `${config.org}-*-${config.name}*`;
const user = new User(stack, "CICDUser", { userName: "CICDStackName" });
new DescribeCloudformationStacks(stack, { stackRegex, config, user });
const template = Template.fromStack(stack);

test("Authorise user to get CI/CD stack outputs ", () => {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: "cloudformation:DescribeStacks",
          Effect: "Allow",
          Resource: {
            "Fn::Join": [
              "",
              [
                "arn:aws:cloudformation:eu-west-1:",
                { Ref: "AWS::AccountId" },
                `:stack/${stack.stackName}/*`,
              ],
            ],
          },
        },
      ]),
    },
  });
});
