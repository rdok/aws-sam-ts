#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { CICDAuthorisationStack } from "../lib/cicd-authorisation-stack";
import { Config } from "../lib/config";

const app = new App();
const config = new Config();

const stackName = `${config.org}-${config.cicdEnvironment}-${config.name}`;
const stackProps = { env: { region: config.region } };

new CICDAuthorisationStack(app, stackName, config, stackProps);
