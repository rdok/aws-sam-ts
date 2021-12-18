import {
  CfnOutput,
  Construct,
  RemovalPolicy,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import { User } from "@aws-cdk/aws-iam";
import { Config } from "./config";
import { SamPolicy } from "./sam-policy";
import { LambdaPolicy } from "./lambda-policy";

export class CICDAuthorisationStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    config: Config,
    props?: StackProps
  ) {
    super(scope, id, props);
    const cicdStackName = `${config.org}-${config.cicdEnvironment}-${config.name}`;
    const stackRegex = `${config.org}-*-${config.name.substring(0, 12)}*`;

    let deploymentBuckets: Bucket[] = [];

    config.environments.forEach((environment) => {
      let environmentNormalised = `${environment[0].toUpperCase()}${environment.slice(
        1
      )}`;
      let deploymentBucketId = `${environmentNormalised}CICDBucket`;
      let deploymentBucketNamePrefix = `${config.org}-${environment}-${config.name}`;

      let deploymentBucket = new Bucket(this, deploymentBucketId, {
        removalPolicy: RemovalPolicy.DESTROY,
        bucketName: `${deploymentBucketNamePrefix}-19102021`,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      });
      deploymentBuckets.push(deploymentBucket);

      new CfnOutput(this, `CICDBucketName`, {
        value: deploymentBucket.bucketName,
      });
    });

    const user = new User(this, "CICDUser", { userName: cicdStackName });
    new SamPolicy(this, { user, config, stackRegex, deploymentBuckets });
    new LambdaPolicy(this, { user, config, stackRegex });
  }
}
