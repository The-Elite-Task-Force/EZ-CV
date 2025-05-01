@secure()
param CHROME_TOKEN string

param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'
param location string = resourceGroup().location
param sku string = 'Standard'

param name string = '${prefix}-${dockerTag}-chromium-container'

resource chromium_container_name_resource 'Microsoft.ContainerInstance/containerGroups@2024-10-01-preview' = {
  name: name 
  location: location
  properties: {
    sku: sku
    containers: [
      {
        name: name
        properties: {
          image: 'ghcr.io/browserless/chromium:latest'
          ports: [
            {
              protocol: 'TCP'
              port: 80
            }
            {
              protocol: 'TCP'
              port: 3000
            }
          ]
          environmentVariables: [
            {
              name: 'HEALTH'
              value: '"true"'
            }
            {
              name: 'TOKEN'
              value: CHROME_TOKEN
            }
            {
              name: 'PROXY_HOST'
              value: '"chrome"'
            }
            {
              name: 'PROXY_PORT'
              value: '3000'
            }
            {
              name: 'PROXY_SSL'
              value: '"false"'
            }
          ]
          resources: {
            requests: {
              memoryInGB: json('1.5')
              cpu: json('1')
            }
          }
        }
      }
    ]
    initContainers: []
    restartPolicy: 'OnFailure'
    ipAddress: {
      ports: [
        {
          protocol: 'TCP'
          port: 80
        }
        {
          protocol: 'TCP'
          port: 3000
        }
      ]
      ip: '40.127.151.47'
      type: 'Public'
    }
    osType: 'Linux'
  }
}

output ip string = chromium_container_name_resource.properties.ipAddress.ip
