// keyvault.bicep
@secure()
param keyVaultName string
@secure()
param location string 

// Key Vault resource (created only if not reusing an existing vault)
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: tenant().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    // (Optional) Enable access from ARM deployments if needed in future:
    // enabledForTemplateDeployment: true 
    accessPolicies: []  // will add policies for services (or use RBAC) in a later step
  }
}
