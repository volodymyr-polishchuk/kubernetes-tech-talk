kubectl apply -f kube/01-client-node-deployment.yaml

kubectl apply -f kube/02-client-node-service.yaml

kubectl apply -f kube/03-metric-database-init-script.yaml

kubectl apply -f kube/04-metric-database-deployment.yaml

kubectl apply -f kube/05-metric-database-service.yaml

