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

test("Authorise minimum AWS SAM actions", () => {
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
                  {
                    "Fn::Join": [
                      "",
                      [
                        "arn:aws:cloudformation:",
                        { Ref: "AWS::Region" },
                        ":",
                        { Ref: "AWS::AccountId" },
                        `:stack/${config.org}-*-${config.name}*/*`,
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "",
                      [
                        "arn:aws:cloudformation:",
                        { Ref: "AWS::Region" },
                        ":aws:transform/Serverless-2016-10-31",
                      ],
                    ],
                  },
                ],
              },
              {
                Action: ["s3:PutObject", "s3:GetObject"],
                Effect: "Allow",
                Resource: [
                  {
                    "Fn::Join": [
                      "",
                      [
                        "arn:aws:s3:::",
                        { Ref: "TestingCICDBucket2E34B30B" },
                        "/*",
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "",
                      [
                        "arn:aws:s3:::",
                        { Ref: "ProductionCICDBucket97E9A4D3" },
                        "/*",
                      ],
                    ],
                  },
                  {
                    "Fn::Join": [
                      "",
                      ["arn:aws:s3:::", { Ref: "DevCICDBucket92696E38" }, "/*"],
                    ],
                  },
                ],
              },
              {
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
                Resource: {
                  "Fn::Join": [
                    "",
                    [
                      "arn:aws:iam::",
                      { Ref: "AWS::AccountId" },
                      `:role/${config.org}-*-${config.name}*`,
                    ],
                  ],
                },
              },
              { Action: "iam:ListPolicies", Effect: "Allow", Resource: "*" },
            ],
            Version: "2012-10-17",
          },
          Description:
            "The minimum required policies for the AWS SAM: MyTestStack",
          Path: "/",
          Users: [{ Ref: stringLike("CICDUser*") }],
        },
      },
      ResourcePart.CompleteDefinition
    )
  );
});
