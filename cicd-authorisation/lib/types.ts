import { Config } from "./config";
import { Role, User } from "@aws-cdk/aws-iam";

export type RolePolicyProps = {
  role: Role;
  config: Config;
  stackRegex: string;
};

export type UserPolicyProps = {
  user: User;
  config: Config;
  stackRegex: string;
};
