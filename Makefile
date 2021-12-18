InvokeLoremIpsum:
	node events/generate-api-gateway-event.js
	npm run build
	sam local invoke \
		--event events/APIGatewayProxyEvent.json \
		--template-file infrastructure.yml \
		--env-vars .env.json \
		'LoremIpsum'

ServeAPI:
	npm run build
	sam local start-api \
		--template-file infrastructure.yml \
		--env-vars .env.json
