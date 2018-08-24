# generator-imatviyenko-dws
Yeomen generator for Docker Swarm enabled Express web service template

The generated web service template has the following features:
- ready scripts for deploying to Docker Swarm and for creating Docker secrets;
- https binding only, uses several techniques available in the helmet npm module for mitigating common web security risk;
- supports http basic authentication scheme via the passport framework out of the box;
- can be run in the development mode on the local node.js instance without Docker;
- uses a verbose custom JSON logging format with Correlation ID tracking and optionally redirects logs from running Docker containers to fluentd forwarders on Docker hosts for further processing in MS Azure Logs Analytics.