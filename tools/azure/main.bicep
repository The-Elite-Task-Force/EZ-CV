param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'
param location string = resourceGroup().location
param sku string = 'Standard'


module webApp './web-app.bicep' = {
  name: '${prefix}-webapp'
  params: {
    prefix: prefix
    location: location
    dockerTag: dockerTag
  }
}

module storageAccount './blob-storage.bicep' = {
  name: '${prefix}-storage'
  params: {
    prefix: prefix
    location: location
  }
}

module appServicePlan './chromio.bicep' = {
  name: '${prefix}-appserviceplan'
  params: {
    prefix: prefix
    location: location
    sku: sku
  }
}

module postgres './postgres.bicep' = {
  name: '${prefix}-postgres'
  params: {
    prefix: prefix
    postgresVersion: '16'
  }
}
