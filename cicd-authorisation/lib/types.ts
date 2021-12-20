import { Config } from "./config";
import { Role } from "@aws-cdk/aws-iam";

export type PolicyProps = {
  role: Role;
  config: Config;
  stackRegex: string;
};
