@secure()
param grafanaAdminPassword string
//@secure()
//param DOCKER_REGISTRY_SERVER_URL string 
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

param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'

resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2021-07-01' = {
  name: '${prefix}-${dockerTag}-grafana-container'
  location: resourceGroup().location
  properties: {
    containers: [
      {
        name: 'grafana-container'
        properties: {
          image: 'grafana/grafana:latest'
          ports: [
            {
              port: 3000
            }
          ]
          environmentVariables: [
            {
              name: 'GF_SECURITY_ADMIN_PASSWORD'
              value: grafanaAdminPassword
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
              name: 'grafana-config'
              mountPath: '/etc/grafana/provisioning/datasources'
              readOnly: true
            }
            {
              name: 'grafana-config'
              mountPath: '/etc/grafana/provisioning/dashboards'
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
          port: 3000
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
        name: 'grafana-config'
        azureFile: {
          shareName: blobStorageContainerName
          storageAccountName: blobStorageAccountName
          storageAccountKey: blobStorageAccountKey
        }
      }
    ]
  }
}
