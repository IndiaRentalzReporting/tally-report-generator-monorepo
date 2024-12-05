docker-build:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yaml build
docker-start:
	docker-compose -f docker-compose.yaml up -d
docker-down:
	docker-compose -f docker-compose.yaml down