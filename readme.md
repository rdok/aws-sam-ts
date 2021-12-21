# aws-sam-ts

[![Deploy][badge_svg_deploy]][workflow_link_deploy]
[![Check][badge_svg_check]][workflow_link_check]

Rapidly create AWS SAM microservices. GitHub template to jumpstart common work:

- NodeJS TypeScript
- SAM template with minimal Lambda function; unit tested
- CI/CD pipelines through GitHub Actions
- Least privileges IAM authorisation for CI/CD. Programmatically, unit tested.
- Makefile with commands to rapidly deploy dev stack locally

# Setup

- [Use this template][use_this_template] to create a new GitHub repository.
- Clone your repository on your local machine.
- Configure AWS CloudFormation, such as stack name, region, and others through `infrastructurerc.json`
- Create & authorise the CI/CD user with the least privileges. These have to be generated through your local machine to avoid putting administrator IAM credentials online.
  - `cd cicd-authorisation && make deploy`
  - Use the link from the output to visit the newly created IAM user.
  - Create access keys
- Add said credentials to GitHub secrets.
- Go to GitHub actions, and deploy the test stack.
- Go to GitHub actions, and deploy the production stack.

# Maintenance

```
make npm-update-all
```

[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
[badge_svg_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml/badge.svg?branch=main
[badge_svg_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml/badge.svg
[workflow_link_deploy]: https://github.com/rdok/aws-sam-ts/actions/workflows/deploy.yml
[workflow_link_check]: https://github.com/rdok/aws-sam-ts/actions/workflows/check.yml
