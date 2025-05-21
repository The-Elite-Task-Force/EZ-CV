targetScope = 'resourceGroup'

@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'
@secure()
param DOCKER_REGISTRY_SERVER_USERNAME string
@secure()
param DOCKER_REGISTRY_SERVER_PASSWORD string

param prefix string = 'ezcv'
@secure()
param POSTGRES_PASSWORD string = 'postgres' //This should be replace with a real password in the .bicepparam files
@secure()
param POSTGRES_USER string = 'postgres' //This should be replace with a real username in the .bicepparam files
@secure()
param CHROME_TOKEN string = 'chrome_token' //This should be replace with a real token in the .bicepparam files, used for the chromio module and is needed in webapp
@secure()
param rgName string 

@secure()
param GrafanaAdminPassword string


param subscriptionId string 
param sku string = 'Standard'




resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' existing = {
  name: rgName
  scope: subscription(subscriptionId)
}

// Deploy Key Vault

module kv './keyvault.bicep' = {
  name: '${prefix}-${dockerTag}-kv'
  params: {
    prefix: prefix
    dockerTag: dockerTag
    DOCKER_REGISTRY_SERVER_USERNAME: DOCKER_REGISTRY_SERVER_USERNAME
    DOCKER_REGISTRY_SERVER_PASSWORD: DOCKER_REGISTRY_SERVER_PASSWORD
  }
  scope: rg
}

// Deploy PostgreSQL
module postgres './postgres.bicep' = {
  name: '${prefix}-${dockerTag}-postgres'
  params: {
    prefix: prefix
    dockerTag: dockerTag
    POSTGRES_USER: POSTGRES_USER
    POSTGRES_PASSWORD: POSTGRES_PASSWORD
    postgresVersion: '16'
    keyVaultName: kv.name
  }
}


//Blob Storage Account
module blobStorage './blob-storage.bicep' = {
  name: '${prefix}-${dockerTag}-blob'
  params: {
    keyVaultName: kv.name
    prefix: prefix
    dockerTag: dockerTag
    location: resourceGroup().location
  }
}

// Chromio
module chromio './chromio.bicep' = {
  name: '${prefix}-${dockerTag}-chromio'
  params: {
    prefix: prefix
    dockerTag: dockerTag
    location: resourceGroup().location
    CHROME_TOKEN: CHROME_TOKEN
    sku: sku
  }
}

// Azure OpenAI
module azureOpenAI './azure-openai.bicep' = {
  name: '${prefix}-${dockerTag}-openai'
  params: {
    keyVaultName: kv.name
    prefix: prefix
    dockerTag: dockerTag
  }
}

// Web App
module webApp './web-app.bicep' = {
  name: '${prefix}-${dockerTag}-webapp'
  scope: rg
  params: {
    prefix: prefix
    location: rg.location
    dockerTag: dockerTag
    CHROME_URL: chromio.outputs.ip
    CHROME_TOKEN: CHROME_TOKEN
    keyVaultName: kv.name
  }
  dependsOn: [
    postgres
    blobStorage
    azureOpenAI
  ]
}

module prometheus 'prometheus.bicep' = {
  name: '${prefix}-${dockerTag}-prometheus'
  scope: rg
  params: {
    prefix: prefix
    dockerTag: dockerTag
    webAppUrl: webApp.outputs.webAppURL
    keyVaultName: kv.name
    DOCKER_REGISTRY_SERVER_USERNAME: DOCKER_REGISTRY_SERVER_USERNAME
    DOCKER_REGISTRY_SERVER_PASSWORD: DOCKER_REGISTRY_SERVER_PASSWORD
  }
}

module grafana 'grafana.bicep' = {
  name: '${prefix}-${dockerTag}-grafana'
  scope: rg
  params: {
    prefix: prefix
    dockerTag: dockerTag
    grafanaAdminPassword: GrafanaAdminPassword
    DOCKER_REGISTRY_SERVER_PASSWORD: DOCKER_REGISTRY_SERVER_PASSWORD
    DOCKER_REGISTRY_SERVER_USERNAME: DOCKER_REGISTRY_SERVER_USERNAME
  }
  dependsOn: [
    prometheus
  ]
}
