#  aws-sam-ts

Rapidly create AWS SAM microservices. GitHub template to jumpstart duplicate work:
- NodeJS TypeScript
- SAM template with minimal AWS infrastructure.
- Unit tested Lambda function
- CI/CD pipelines through GitHub Actions
- Least privileges IAM authorisation for CI/CD GitHub runner. Programmatically, unit tested.

# Setup
- [Use this template][use_this_template] to create a new GitHub repository.

### Least privileges for CI/CD user 
- Clone your repository on your local machine.
- Configure AWS CloudFormation through `infrastructurerc.json`
- Create & authorise the CI/CD user with the least privileges. These have to be generated through your local machine to avoid putting administrator IAM credentials online.
  - `cd cicd-authorisation && make deploy`
  - Use the link from the output to visit the newly created IAM user.
  - Create access keys
- Add said credentials to GitHub secrets.
- Go to GitHub actions, and deploy the test stack.
- Go to GitHub actions, and deploy the production stack.
 
# Maintenance
- `npx npm-check --update-all`
- `cd cicd-authorisation && npx npm-check --update-all`

[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
