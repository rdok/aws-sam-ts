.PHONY: test
test: node_modules
	npm run test

test-watch: node_modules
	npm run test:watch

deploy:
	cdk deploy

prettier-fix:
	npm run prettier:fix

node_modules:
	npm ci
