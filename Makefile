docker-up-dev:
	docker-compose -f docker-compose.dev.yaml up -d
docker-down-dev:
	docker-compose -f docker-compose.dev.yaml down
docker-build-prod:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.prod.yaml build
docker-up-prod:
	docker-compose -f docker-compose.prod.yaml up -d
docker-down-prod:
	docker-compose -f docker-compose.prod.yaml down