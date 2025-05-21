// azure-openai.bicep

@description('Prefix for all resources')
param prefix string



@description('Model Version, eg chatgpt-4o-mini, gpt-4, gpt-4o, it is also used as the deployment name for the Model to be deployed')
param model string = 'gpt-4o-mini'

@description('Deployment stage (e.g. latest, beta, prod)')
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string

@description('Key Vault Name')
param keyVaultName string

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

@description('OpenaI Service location, hardcoded to because of the OpenAI Service availability')
var location = 'swedencentral'

// Derive a unique name for the OpenAI Service account
var openAIAccountName = '${prefix}-${dockerTag}-openai'

// Deploy OpenAi Azure OpenAI Service (Cognitive Services account)
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: openAIAccountName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    restore: true // OpenAi reacts differently when destoryed, it doesn't get instantaniasly purged like the other resource and cannot be redeployed in this state unless recover is set to 'true'. 
  }
}

// Deploy the GPT-4o-mini model to the OpenAI resource
resource gptDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: model
  parent: openAIAccount
  sku: {
    name: 'Standard'
    capacity: 1
  }
  properties: {
    model: {
      name: model
      version: '2024-07-18'
      format: 'OpenAI'
    }
    raiPolicyName: 'Microsoft.Default'
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
}

//Save the OpenAI key in Key Vault
resource openAIKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AZURE-OPENAI-API-KEY'
  properties: {
    value: openAIAccount.listKeys().key1
  }
}
//Save The OpenAI endpoint in Key Vault
resource openAIEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: openAIAccount.properties.endpoint
  }
  dependsOn: [
    kv
  ]
}

// Save the OpenAI deployment name in Key Vault
resource openAIDeploymentNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'OPENAI-MODEL'
  properties: {
    value: gptDeployment.name
  }
  dependsOn: [
    kv
  ]
}

