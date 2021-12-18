import {
  expect as expectCDK,
  haveResource,
  ResourcePart,
  stringLike,
} from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";

const app = new App();
const config = new Config();
const stack = new CICDAuthorisationStack(app, "MyTestStack", config);

test("Authorise Lambdas management", () => {
  expectCDK(stack).to(
    haveResource(
      "AWS::IAM::ManagedPolicy",
      {
        Type: "AWS::IAM::ManagedPolicy",
        Properties: {
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
          Description: "Policy to manage lambda functions: MyTestStack",
          Path: "/",
          Users: [{ Ref: stringLike("CICDUser*") }],
        },
      },
      ResourcePart.CompleteDefinition
    )
  );
});
