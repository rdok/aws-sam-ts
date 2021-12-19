#  aws-sam-ts

Rapidly create AWS SAM microservice with:
- NodeJS TypeScript
- AWS SAM template
- Unit tested Lambda function
- CI/CD pipelines through GitHub Actions

# Setup
- [Use this template][use_this_template] to create a new GitHub repository.

### Least privileges for CI/CD user 
> Efficient way to create IAM policies. Programmatically, unit tested. 
- Clone your repository on your local machine.
- Configure AWS CloudFormation through `infrastructurerc.json`
- Create & authorise the CI/CD user with least priveleges. This has to be run through your local machine for security reasons.
  - `cd cicd-authorisation && make deploy`
- Visit your AWS IAM dashboard and to get the credentials for the new IAM user created.
- Add said credentials to GitHub secrets.
- Go to GitHub actions, and deploy the test stack.
- Go to GitHub actions, and deploy the production stack.
 
### TODO
Automate ts compilation for faster development on testing API Gateways. Simple approach is file watcher, a more complex but more value long term is webpack

# Template Maintaince
- `npx npm-check --update-all`
- `cd cicd-authorisation && npx npm-check --update-all`

[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
