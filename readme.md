#  aws-sam-ts

# Setup
- [Use this template][use_this_template] to create a new GitHub repository.
- Clone the repository on your local machine.
- Create an IAM user for the GitHub runner with the least privileges.
  - To create said credentials, administrator access is required.
  - To keep things secure, run the following command, once, only from your local machine.
  - `cd cicd-authorisation && make deploy`
- Visit your AWS IAM dashboard and to get the credentials for the new IAM user created.
- Add said credentials to GitHub secrets.
- Go to GitHub actions, and deploy the test stack.
- Go to GitHub actions, and deploy the production stack.
 
### TODO
Automate ts compilation for faster development on testing API Gateways. Simple approach is file watcher, a more complex but more value long term is webpack


[use_this_template]: https://github.com/rdok/aws-sam-ts/generate
