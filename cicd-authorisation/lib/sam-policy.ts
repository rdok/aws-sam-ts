import { Stack } from "@aws-cdk/core";
import { Effect, ManagedPolicy, PolicyStatement } from "@aws-cdk/aws-iam";
import { RolePolicyProps } from "./types";

type SamPolicyProps = RolePolicyProps & { deploymentBucketName: string };

export class SamPolicy {
  constructor(stack: Stack, props: SamPolicyProps) {
    const { stackRegex, deploymentBucketName, role } = props;
    const samPolicy = new ManagedPolicy(stack, "SAMPolicy", {
      description: `The minimum required policies for the AWS SAM: ${stack.stackName}`,
      roles: [role],
    });
    samPolicy.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:cloudformation:${stack.region}:${stack.account}:stack/${stackRegex}/*`,
          `arn:aws:cloudformation:${stack.region}:aws:transform/Serverless-2016-10-31`,
        ],
        actions: [
          "cloudformation:CreateChangeSet",
          "cloudformation:GetTemplateSummary",
          "cloudformation:DescribeStacks",
          "cloudformation:DescribeStackEvents",
          "cloudformation:DeleteStack",
          "cloudformation:DescribeChangeSet",
          "cloudformation:ExecuteChangeSet",
        ],
      })
    );
    samPolicy.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`arn:aws:s3:::${deploymentBucketName}/*`],
        actions: ["s3:PutObject", "s3:GetObject"],
      })
    );
    samPolicy.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`arn:aws:iam::${stack.account}:role/${stackRegex}`],
        actions: [
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
      })
    );
    samPolicy.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["*"],
        actions: ["iam:ListPolicies"],
      })
    );
  }
}
