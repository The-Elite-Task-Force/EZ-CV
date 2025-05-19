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
param keyVaultResourceGroup string
@secure()
param subscriptionId string





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
    rgName: rg.name
    kvRgName: keyVaultResourceGroup
    subscriptionId: subscriptionId
  }
}

