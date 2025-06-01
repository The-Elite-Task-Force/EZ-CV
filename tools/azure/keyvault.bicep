// keyvault.bicep

param prefix string = 'ezcv'
param dockerTag string = 'latest'

@secure()
param DOCKER_REGISTRY_SERVER_USERNAME string
@secure()
param DOCKER_REGISTRY_SERVER_PASSWORD string

// Key Vault resource (created only if not reusing an existing vault)
resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${prefix}-${dockerTag}-kv'
  location: resourceGroup().location
  properties: {
  tenantId: tenant().tenantId
  sku: {
    name: 'standard'
    family: 'A'
  }
  enabledForTemplateDeployment: true
  accessPolicies: [
    {
      tenantId: az.deployer().tenantId         // Tenant of the deployer identity
      objectId: az.deployer().objectId         // Object ID of the caller principal
      permissions: {
        secrets: [ 'get', 'list', 'set' ]     // Grant exactly what you need
      }
    }
  ]
}
}

// Save Secrets in Key Vault
resource dockerRegistryServerUsernameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'DOCKER-REGISTRY-SERVER-USERNAME'
  properties: {
    value: DOCKER_REGISTRY_SERVER_USERNAME
  }
}

resource dockerRegistryServerPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'DOCKER-REGISTRY-SERVER-PASSWORD'
  properties: {
    value: DOCKER_REGISTRY_SERVER_PASSWORD
  }
}


