import { Stack } from "@aws-cdk/core";
import { Effect, ManagedPolicy, PolicyStatement } from "@aws-cdk/aws-iam";
import { RolePolicyProps } from "./types";

export class MonitorPolicy {
  constructor(stack: Stack, props: RolePolicyProps) {
    const { stackRegex, role } = props;
    const monitorPolicy = new ManagedPolicy(stack, "MonitorPolicy", {
      description: `Authorise monitor AWS resources for stack: ${stack.stackName}`,
      roles: [role],
    });
    monitorPolicy.addStatements(
      new PolicyStatement({
        actions: [
          "SNS:CreateTopic",
          "SNS:GetTopicAttributes",
          "SNS:DeleteTopic",
        ],
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:sns:${stack.region}:${stack.account}:${stackRegex}`,
        ],
      })
    );
  }
}
