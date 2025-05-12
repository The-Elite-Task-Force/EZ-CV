// azure-openai.bicep

@description('Prefix for all resources')
param prefix string

@description('Deployment stage (e.g. latest, beta, prod)')
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string

@description('Location for all resources')
var location = 'swedencentral'

// Derive a unique name for the OpenAI Service account
var openAIAccountName = '${prefix}-${dockerTag}-openai'

// Azure OpenAI Service (Cognitive Services account)
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: openAIAccountName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {}
}

// Deploy the GPT-4o-mini model to the OpenAI resource
resource gptDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: 'gpt-4o-mini'
  parent: openAIAccount
  sku: {
    name: 'Standard'
    capacity: 1
  }
  properties: {
    model: {
      name: 'gpt-4o-mini'
      version: '2024-07-18'
      format: 'OpenAI'
    }
    raiPolicyName: 'Microsoft.Default'
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
}

// Outputs
output openAIEndpoint string = openAIAccount.properties.endpoint
output openAIName string = openAIAccount.name
