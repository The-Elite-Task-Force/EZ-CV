@secure()
param grafanaAdminPassword string
@secure()
param DOCKER_REGISTRY_SERVER_PASSWORD string 
@secure()
param DOCKER_REGISTRY_SERVER_USERNAME string 

param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'

@secure()
param prometheusUrl  string 

// Load & patch Grafana provisioning files
var rawDS = loadTextContent('../grafana/datasources/datasource.yml')
var dsConfig = replace(rawDS, 'http://ezcv-promethus.azurewebsites.net',prometheusUrl )

var dbConfig = loadTextContent('../grafana/dashboards/dashboard.yml')

resource cg 'Microsoft.ContainerInstance/containerGroups@2021-07-01' = {
  name: '${prefix}-${dockerTag}-grafana'
  location: resourceGroup().location
  properties: {
    osType: 'Linux'
    restartPolicy: 'Always'
    ipAddress: { type: 'Public'
     ports: [
      {
         port: 3000
         protocol: 'TCP' }
        ]
       }
    containers: [
      {
        name: 'grafana'
        properties: {
          image: 'grafana/grafana:latest'
          ports: [{ port: 3000 }]
          volumeMounts: [
            {
              name: 'grafana-datasources'
              mountPath: '/etc/grafana/provisioning/datasources'
            }
            {
              name: 'grafana-dashboards'
              mountPath: '/etc/grafana/provisioning/dashboards'
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
             cpu:1
             memoryInGB:1 } 
            }
        }
      }
    ]
    imageRegistryCredentials: [
      {
        server: 'index.docker.io'
        username: DOCKER_REGISTRY_SERVER_USERNAME
        password: DOCKER_REGISTRY_SERVER_PASSWORD
      }
    ]
    volumes: [
      {
        name: 'grafana-datasources'
        secret: {
          'datasource.yml': dsConfig
        }
      }
      {
        name: 'grafana-dashboards'
        secret: {
          'dashboard.yml': dbConfig
        }
      }
    ]
  }
}
