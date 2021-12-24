# aws-sam-ts

[![Deploy][badge_svg_deploy]][workflow_link_deploy]
[![Check][badge_svg_check]][workflow_link_check]

Rapidly create AWS SAM microservices. GitHub template to jumpstart common work.

# Features

- NodeJS TypeScript compilation to JS for AWS Lambda.
- SAM template with minimal Lambda function
- Unit tests for Lambda handlers & libraries.
- CI/CD pipelines through GitHub Actions.
- CI/CD Security best practise [granting the least privileges](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege); through AWS CDK unit tested.
- CI/CD Security best practise using [role to delegate permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#delegate-using-roles). through AWS CDK unit tested.
- Makefile with commands to rapidly deploy dev stack locally
- Automated dependency updates through GitHub's dependabot for NPM packages & GitHub action depedencies.

# Setup

- [Use this template][use_this_template] to create a new GitHub repository.
- Clone your repository on your local machine.
- Configure AWS CloudFormation, such as stack name, region, and others through `infrastructurerc.json`
- Create & authorise the CI/CD user with the least privileges. These have to be generated through your local machine to avoid putting administrator IAM credentials online.
  - `cd cicd-authorisation && make deploy`
  - Use the link from the output to visit the newly created IAM user.
  - Create access key
- Add this access key as [GitHub encrypted repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)
- Once you commit & git push to main branch, it will be deployed to the default test stack
- Deploy to production environment by clicking the `Run workflow` button in `Deploy` action. [Example](https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml)

[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
[badge_svg_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml/badge.svg?branch=main
[badge_svg_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml/badge.svg
[workflow_link_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml
[workflow_link_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml
