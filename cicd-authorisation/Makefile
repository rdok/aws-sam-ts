.PHONY: test
test: node_modules
	npm run test

test-watch: node_modules
	npm run test:watch

deploy: node_modules
	npx cdk deploy

prettier-fix: node_modules
	npm run prettier:fix

node_modules:
	npm ci
