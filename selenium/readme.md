## Selenium grid

### Getting the selenium image

`kubectl run selenium-hub --image selenium/hub --port 4444`

### Selenium grid exposed

### Exposed to the Kubernetes cluster

`kubectl expose deployment selenium-hub --type=NodePort`

#### Exposed on the localhost (running Kubernetes locally)

`kubectl expose deployment selenium-hub --type=LoadBalancer --name=selenium hub`

### Spin up a Chrome node

`kubectl run selenium-node-chrome --image selenium/node-chrome --env="HUB_PORT_4444_TCP_ADDR=selenium-hub" --env="HUB_PORT_4444_TCP_PORT=4444"`

### Scale up the nodes

`kubectl scale deployment selenium-node-chrome --replicas=6`

## Tests setup

To run them locally with the selenium stand alone, 
- go to the wdio.conf.js and uncomment `//services: ['selenium-standalone'],`
- execute selenium-standalone start