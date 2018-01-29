# Kubernetes tutorial

<https://kubernetes.io/docs/tutorials/>

## Create a Cluster

### Cluster up and running

1. Install minikube
2. `minikube version`
3. `minikube start`
4. `kubectl version`

## Cluster details

- `kubectl cluster-info`
- `kubectl get nodes`: displays the kubernetes nodes available

## Deploy our app

- `kubectl run kubernetes-bootcamp --image=docker.io/jocatalin/kubernetes-bootcamp:v1 --port=8080` : creates the deployment with name `kubernetes-bootcamp` from the image provided `docker.io/jocatalin/kubernetes-bootcamp:v1` and will run the app on `port=8080`. This performed a few things for you:

  - Searched for a suitable node where an instance of the application could be run (we have only 1 available node)
  - Scheduled the application to run on that Node
  - Configured the cluster to reschedule the instance on a new Node when needed
- `kubectl get deployments`

## View our app

- `kubectl describe pods`: details about the Pod’s container: IP address, the ports used and a list of events related to the lifecycle of the Pod.
- `kubectl proxy`: creates proxy access to the pods. Once running, by getting the pods name we can access the app:
  - `kubectl get pods`: returns the pods names
  - `curl http://localhost:8001/api/v1/proxy/namespaces/default/pods/$POD_NAME`: The url is the route to the API of the Pod

## Exploring your app

### Check application configuration

- `kubectl get pods`
- `kubectl describe pods`

### Show the app on the terminal

- On new terminal `kubectl proxy`
- `curl http://localhost:8001/api/v1/proxy/namespaces/default/pods/podName` : will show the output of the app.
- `kubectl logs podName`

### Executing command on the container

- `kubectl exex podName env`: displays env variables
- `kubectl exec -ti podName bash`: opens bash on container

## Exposing Your App

### Create a new service

1. `kubectl get pods`: list available pods
2. `kubectl get services`: list current Services from our Cluster.
3. `kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080`: creates a service from the deployment `deployment/kubernetes-bootcamp` using the `type="NodePort"`. The Service receives a unique cluster-IP, an internal port and an external-IP (the IP of the Node)
4. `kubectl get services`: the new Service received a unique cluster-IP, an internal port and an external-IP (the IP of the Node).
5. `kubectl describe services/kubernetes-bootcamp`: will display what port was opened externally (by the NodePort option).
6. `curl podIP:nodePort`: gives response from server

### Using labels

After a deployment, a label is created automatically, can be inspected with `kubectl describe deployment`

- `kubectl get pods -l anyLabel`: query list of pods by label
- `kubectl get services -l anyLabel`: query list of services by label
- `kubectl label pod $POD_NAME app=v1`: will apply "v1" label to the pod

### Deleting a service

- `kubectl delete service -l run=kubernetes-bootcamp`: deletes the service by the label

This should stop the outside from accessing the app while the app is still accessible through the inside:

1. `kubectl get services`: should not display the service
2. `curl hostIP:nodePort`: should fail
3. `kubectl exec -ti podIP curl localhost:8080`: should return the app output

## Scaling your app

### Scaling a Deployment

1. `kubectl get deployments`: this sows:

    - The DESIRED state is showing the configured number of replicas
    - The CURRENT state show how many replicas are running now
    - The UP-TO-DATE is the number of replicas that were updated to match the desired (configured) state
    - The AVAILABLE state shows how many replicas are actually AVAILABLE to the users

2. `kubectl scale deployments/kubernetes-bootcamp --replicas=4`: sacels the deployment `kubernetes-bootcamp` to 4 replicas
3. `kubectl get deployments`: all numbers from the previous run should have been updated.
4. `kubectl get pods -o wide`: displays running depliclas

### Load balancing

- `kubectl describe services/kubernetes-bootcamp`: get the node port
- `kubectl describe nodes`: get the internal ip for the node
- `curl nodeIP:nodePort`

### Scale down

- `kubectl scale deployments/kubernetes-bootcamp --replicas=2`: reduce to 2 replicas
- `kubectl get deployments` should display 2 instances
- `kubectl get pods -o wide` confirms the removeal of 2 pods

## Updating your app

### Update the version of the app

- Upscale the deployment `kubectl scale deployments/kubernetes-bootcamp --replicas=4`
- check deployments `kubectl get deployments`
- `kubectl get pods`
- `kubectl describe pods`
- `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2`: updates the application to version 2
- `kubectl get pods` to check and see the old images terminating

## Update verification

- get the ip fro the node: `kubctl get node -o wide`
- get the port where node is available: `kubectl describe services/kubernetes-bootcamp`
- `curl node_IP:node_Port`
- `kubectl rollout status deployments/kubernetes-bootcamp` to verify the rollout
- `kubectl describe nodes` should show the updated version

## Rollback an update

- updating to v10: `kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v10`
- `kubectl get deployments`: something is wrong, as the number of desired is incorrect
- `kubectl get pods` shows wrong number of images
- `kubectl describe pods`: shows that everything is on v2 still
- `kubectl rollout undo deployments/kubernetes-bootcamp`: reverted the deployment to the previous knonw state
- `kubectl get pods` shows all the pods up and running
- `kubectl describe pods` shows everything is on v2