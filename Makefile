export AWS_REGION=$(shell jq -r '.region' infrastructurerc.json)
export NAME=$(shell jq -r '.name' infrastructurerc.json)
export ORG=$(shell jq -r '.org' infrastructurerc.json)
export AWS_CICD_STACK_NAME=$(shell echo "${ORG}-cicd-${NAME}")

InvokeLoremIpsum:
	node events/generate-api-gateway-event.js
	npm run build
	sam local invoke \
		--event events/APIGatewayProxyEvent.json \
		--template-file infrastructure.yml \
		--env-vars .env.json \
		'LoremIpsum'

deploy-cicd-auth:
	cd cicd-authorisation && make deploy

deploy-dev:
	echo $$AWS_CICD_STACK_NAME
	npm ci && npm run build && npm ci --production
	sam build --template infrastructure.yml
	AWS_ROLE_ARN=$$(aws --profile cicd_aws_sam_ts --region $$AWS_REGION \
		cloudformation describe-stacks --stack-name $$AWS_CICD_STACK_NAME \
		--query 'Stacks[0].Outputs[?OutputKey==`CICDRoleARN`].OutputValue' \
		--output text) && \
	ASSUME_ROLE=$$(aws --profile cicd_aws_sam_ts --region $$AWS_REGION --output json \
		sts assume-role --role-arn $$AWS_ROLE_ARN --role-session-name cicd-access \
		--query "Credentials") && \
	export AWS_ACCESS_KEY_ID=$$(echo $$ASSUME_ROLE | jq -r '.AccessKeyId') && \
	export AWS_SECRET_ACCESS_KEY=$$(echo $$ASSUME_ROLE | jq -r '.SecretAccessKey') && \
	export AWS_SESSION_TOKEN=$$(echo $$ASSUME_ROLE | jq -r '.SessionToken') && \
	sam deploy --config-env dev --no-fail-on-empty-changeset
	npm ci

update-all-npm:
	npx npm-check --update-all
	cd cicd-authorisation && npx npm-check --update-all
