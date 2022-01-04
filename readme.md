# aws-sam-ts

[![Deploy][badge_svg_deploy]][workflow_link_deploy]
[![Check][badge_svg_check]][workflow_link_check]

Rapidly create AWS SAM microservices. GitHub template to jumpstart common work.

# Features

- Compiles NodeJS TypeScript to JS for AWS Lambda.
- Uses SAM template to create Lambda function
- Unit tests the Lambda handlers & libraries.
- Runs CI/CD pipelines through GitHub Actions.
- Monitors Lambda errors, and triggers CloudWatch Alarm.
- [Grants the least privileges](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege) CI/CD security best practise; through AWS CDK unit tested.
- [Delegates permissions through role](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#delegate-using-roles) CI/CD security best practise; through AWS CDK unit tested.
- Rapidly deploys dev stack locally through Makefile commands
- Automates dependency updates for NPM packages.
- Automates dependency updates for GitHub actions dependencies.
- Reuses CI checks through [reusable GitHub workflows](https://docs.github.com/en/actions/learn-github-actions/reusing-workflows)
- Ensures [![Deploy][badge_svg_deploy]][workflow_link_deploy] workflow runs at a time through GitHub's [concurrency](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#concurrency) feature.

# Setup

- [Use this template][use_this_template] to create a new GitHub repository.
- Clone your repository on your local machine.
- Configure AWS CloudFormation, such as stack name, region, and others through `infrastructurerc.json`
- Find & global replace `aws-sam-ts` with your service name.
- Create & authorise the CI/CD user with the least privileges. These have to be generated through your local machine to avoid putting administrator IAM credentials online.
  - `cd cicd-authorisation && make deploy`
  - Use the link from the output to visit the newly created IAM user.
  - Create access key
- Add the access keys as [GitHub encrypted repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository): [AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY](https://github.com/rdok/aws-sam-ts/blob/e0a64f5d81c1e57c72a5aa0247e6939016d3a4da/.github/workflows/deploy.yml#L3)
- Once you commit & git push to main branch, it will be deployed to the default test stack
- Verify setup by deploying development CloudFormation stack:
  - This is the fastest development workflow and highly recommended.
  - Add an AWS profile in `~/.aws/credentials` named `cicd_{{your_service_name}}` with credentials retrieved from cicd-authorisation creation.
  - `make deploy-dev`.
- Deploy to production environment by clicking the `Run workflow` button in `Deploy` action. [Example](https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml)
- Use the exported output `MonitorActionsArn` to integrate with AWS Chatbot Slack, emails, or other integration types.

[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
[badge_svg_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml/badge.svg?branch=main
[badge_svg_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml/badge.svg
[workflow_link_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml
[workflow_link_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml
