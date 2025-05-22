@secure()
param DOCKER_REGISTRY_SERVER_PASSWORD string 
@secure()
param DOCKER_REGISTRY_SERVER_USERNAME string 

@secure()
param blobStorageContainerName string
@secure()
param blobStorageAccountName string
@secure()
param blobStorageAccountKey string

param webAppUrl string 

param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'

resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2021-07-01' = {
  name: '${prefix}-${dockerTag}-prometheus-container'
  location: resourceGroup().location
  properties: {
    containers: [
      {
        name: 'prometheus-container'
        properties: {
          image: 'prom/prometheus:latest'
          ports: [
            {
              port: 9090
            }
          ]
          environmentVariables: [
            {
              name: 'WEB_APP_URL'
              value: webAppUrl
            }
          ]
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }  
          volumeMounts: [
            {
              name: 'prometheus-config'
              mountPath: '/etc/prometheus/prometheus.yml'
              readOnly: true
            }
          ]  
        }
      }
    ]
    osType: 'Linux'
    restartPolicy: 'Always'
    ipAddress: {
      type: 'Public'
      ports: [
        {
          port: 9090
          protocol: 'TCP'
        }
      ]
    }
    imageRegistryCredentials: [
      {
        server: 'index.docker.io'
        username: DOCKER_REGISTRY_SERVER_USERNAME
        password: DOCKER_REGISTRY_SERVER_PASSWORD
      }
    ]
    volumes: [
      {
        name: 'prometheus-config'
        azureFile: {
          shareName: blobStorageContainerName
          storageAccountName: blobStorageAccountName
          storageAccountKey: blobStorageAccountKey
          readOnly: true
        }
      }
    ]
  }
}

output ip string = containerGroup.properties.ipAddress.ip
