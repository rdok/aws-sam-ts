import { User } from '@aws-cdk/aws-iam';
import { Config } from './config';

export type PolicyProps = {
  user: User;
  config: Config;
  stackRegex: string;
};
