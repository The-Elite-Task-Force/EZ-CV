targetScope = 'subscription'

param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'
param sku string = 'Standard'

@secure()
param subscriptionId string

@description('PostgreSQL username, replace with a real username in the .bicepparam files')
@secure() 
param POSTGRES_USER string 
@description('PostgreSQL password, replace with a real password in the .bicepparam files')
@secure()
param POSTGRES_PASSWORD string 
@description('chrome token, replace with a real token in the .bicepparam files, used for the chromio module and is needed in webapp')
@secure()
param CHROME_TOKEN string 

@secure()
param DOCKER_REGISTRY_SERVER_USERNAME string
@secure()
param DOCKER_REGISTRY_SERVER_PASSWORD string
@secure()
param GrafanaAdminPassword string
@secure()
param ACCESS_TOKEN_SECRET string
@secure()
param REFRESH_TOKEN_SECRET string


resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${prefix}-${dockerTag}-rg'
  location: deployment().location
}

module infra 'deployment.bicep' = {
  name: '${prefix}-${dockerTag}-infra'
  scope: rg
  params: {
    prefix: prefix
    dockerTag: dockerTag
    DOCKER_REGISTRY_SERVER_USERNAME: DOCKER_REGISTRY_SERVER_USERNAME
    DOCKER_REGISTRY_SERVER_PASSWORD: DOCKER_REGISTRY_SERVER_PASSWORD
    rgName: rg.name
    subscriptionId: subscriptionId
    POSTGRES_USER: POSTGRES_USER
    POSTGRES_PASSWORD: POSTGRES_PASSWORD
    sku: sku
    CHROME_TOKEN: CHROME_TOKEN
    GrafanaAdminPassword: GrafanaAdminPassword
    ACCESS_TOKEN: ACCESS_TOKEN_SECRET
    REFRESH_TOKEN: REFRESH_TOKEN_SECRET
  }
}

