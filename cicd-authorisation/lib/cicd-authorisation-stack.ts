import {
  CfnOutput,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Role, User } from "aws-cdk-lib/aws-iam";
import { Config } from "./config";
import { SamPolicy } from "./sam-policy";
import { LambdaPolicy } from "./lambda-policy";
import { DescribeCloudformationStacks } from "./describe-cloudformation-stacks";
import { MonitorPolicy } from "./monitor-policy";

export class CICDAuthorisationStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    config: Config,
    props?: StackProps
  ) {
    super(scope, id, props);

    const deploymentBucket = new Bucket(this, "CICDBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: `${config.org}-${config.cicdEnvironment}-${config.name}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    new CfnOutput(this, `CICDBucketName`, {
      value: deploymentBucket.bucketName,
    });

    const CICDStackName = `${config.org}-${config.cicdEnvironment}-${config.name}`;
    const user = new User(this, "CICDUser", { userName: CICDStackName });
    new CfnOutput(this, "CICDIAMUserLink", {
      value: `https://console.aws.amazon.com/iam/home?#/users/${user.userName}?section=security_credentials`,
    });

    const role = new Role(this, "CICDRole", { assumedBy: user });
    new CfnOutput(this, "CICDRoleARN", { value: role.roleArn });

    const stackRegex = `${config.org}-*-${config.name.substring(0, 12)}*`;
    new SamPolicy(this, {
      config,
      stackRegex,
      deploymentBucketName: deploymentBucket.bucketName,
      role,
    });
    new LambdaPolicy(this, { config, stackRegex, role });
    new DescribeCloudformationStacks(this, { config, stackRegex, user });
    new MonitorPolicy(this, { config, stackRegex, role });
  }
}
