create-network:
	docker network create trg_network
build:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yaml build
start:
	docker-compose -f docker-compose.yaml up -d
stop-all:
	docker kill $(docker ps -q) && docker rm $(docker ps -a -q)