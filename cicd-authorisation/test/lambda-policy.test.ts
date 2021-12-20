import { Stack } from "@aws-cdk/core";
import { Config } from "../lib/config";
import { Template } from "@aws-cdk/assertions";
import { LambdaPolicy } from "../lib/lambda-policy";
import { Role, User } from "@aws-cdk/aws-iam";

const config = new Config();
const stack = new Stack();
const stackRegex = `${config.org}-*-${config.name}*`;
const user = new User(stack, "CICDUser", { userName: "CICDStackName" });
const role = new Role(stack, "Role", { assumedBy: user });
new LambdaPolicy(stack, { stackRegex, config, role });
const template = Template.fromStack(stack);

test("Authorise Lambdas management", () => {
  template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "lambda:ListTags",
            "lambda:TagResource",
            "lambda:UntagResource",
            "lambda:UpdateFunctionCode",
            "lambda:GetFunction",
            "lambda:CreateFunction",
            "lambda:DeleteFunction",
            "lambda:GetFunctionConfiguration",
            "lambda:UpdateFunctionConfiguration",
            "lambda:PutFunctionEventInvokeConfig",
            "lambda:UpdateFunctionEventInvokeConfig",
            "lambda:DeleteFunctionEventInvokeConfig",
            "lambda:AddPermission",
            "lambda:RemovePermission",
            "lambda:InvokeFunction",
          ],
          Effect: "Allow",
          Resource: {
            "Fn::Join": [
              "",
              [
                "arn:aws:lambda:",
                { Ref: "AWS::Region" },
                ":",
                { Ref: "AWS::AccountId" },
                `:function:${config.org}-*-${config.name}*`,
              ],
            ],
          },
        },
      ],
      Version: "2012-10-17",
    },
  });
});
