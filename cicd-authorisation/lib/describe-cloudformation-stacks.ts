import { Stack } from "@aws-cdk/core";
import { Effect, ManagedPolicy, PolicyStatement } from "@aws-cdk/aws-iam";
import { UserPolicyProps } from "./types";

export class DescribeCloudformationStacks {
  constructor(stack: Stack, { user }: UserPolicyProps) {
    const describeCloudformationPolicy = new ManagedPolicy(
      stack,
      "DescribeCloudFormationPolicy",
      {
        description: `Policy to manage Cloudformation describe: ${stack.stackName}`,
        users: [user],
      }
    );
    describeCloudformationPolicy.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:cloudformation:eu-west-1:${stack.account}:stack/${stack.stackName}/*`,
        ],
        actions: ["cloudformation:DescribeStacks"],
      })
    );
  }
}
