.PHONY: test
test: node_modules clean-ts
	npm run test

test-watch: node_modules clean-ts
	npm run test:watch

deploy:
	cdk deploy

prettier-fix:
	npm run prettier:fix

node_modules:
	npm ci

clean-ts:
	npm run ts:cleanup-test
