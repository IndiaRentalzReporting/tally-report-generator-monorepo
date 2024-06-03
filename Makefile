build_server_image:
	docker build -t kapoor17/mern_template_server_image:0.0.0.RELEASE -f apps/server/Dockerfile .
build_client_image:
	docker build -t kapoor17/mern_template_client_image:0.0.0.RELEASE -f apps/client/Dockerfile .