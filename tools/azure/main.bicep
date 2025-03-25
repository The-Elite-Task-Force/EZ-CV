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

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: 'ez-cv-keyVault'
  scope: resourceGroup(subscriptionId, keyVaultResourceGroup)
}

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${prefix}-${dockerTag}-rg'
  location: deployment().location
}

module webApp './web-app.bicep' = {
  name: '${prefix}-${dockerTag}-webapp'
  scope: rg
  params: {
    prefix: prefix
    location: rg.location
    dockerTag: dockerTag
    ACCESS_TOKEN_SECRET: kv.getSecret('ACCESS-TOKEN-SECRET')
    APPLICATIONINSIGHTS_CONNECTION_STRING: kv.getSecret('APPLICATIONINSIGHTS-CONNECTION-STRING')
    ApplicationInsightsAgent_EXTENSION_VERSION: kv.getSecret('ApplicationInsightsAgent-EXTENSION-VERSION')
    AZURE_ACCOUNT_KEY: kv.getSecret('AZURE-ACCOUNT-KEY')
    AZURE_ACCOUNT_NAME: kv.getSecret('AZURE-ACCOUNT-NAME')
    AZURE_STORAGE_CONTAINER: kv.getSecret('AZURE-STORAGe-CONTAINER')
    CHROME_TOKEN: kv.getSecret('CHROME-TOKEN')
    CHROME_URL: kv.getSecret('CHROME-URL')
    CHROME_PORT: kv.getSecret('CHROME-PORT')
    DATABASE_URL: kv.getSecret('DATABASE-URL')
    DOCKER_ENABLE_CI: kv.getSecret('DOCKER-ENABLE-CI')
    DOCKER_REGISTRY_SERVER_PASSWORD: kv.getSecret('DOCKER-REGISTRY-SERVER-PASSWORD')
    DOCKER_REGISTRY_SERVER_URL: kv.getSecret('DOCKER-REGISTRY-SERVER-URL')
    DOCKER_REGISTRY_SERVER_USERNAME: kv.getSecret('DOCKER-REGISTRY-SERVER-USERNAME')
    GITHUB_CALLBACK_URL: kv.getSecret('GITHUB-CALLBACK-URL')
    GITHUB_CLIENT_ID: kv.getSecret('GITHUB-CLIENT-ID')
    GITHUB_CLIENT_SECRET: kv.getSecret('GITHUB-CLIENT-SECRET')
    GOOGLE_CALLBACK_URL: kv.getSecret('GOOGLE-CALLBACK-URL')
    GOOGLE_CLIENT_ID: kv.getSecret('GOOGLE-CLIENT-ID')
    GOOGLE_CLIENT_SECRET: kv.getSecret('GOOGLE-CLIENT-SECRET')
    MICROSOFT_AUTHORIZATION_URL: kv.getSecret('MICROSOFT-AUTHORIZATION-URL')
    MICROSOFT_CALLBACK_URL: kv.getSecret('MICROSOFT-CALLBACK-URL')
    MICROSOFT_CLIENT_ID: kv.getSecret('MICROSOFT-CLIENT-ID')
    MICROSOFT_CLIENT_SECRET: kv.getSecret('MICROSOFT-CLIENT-SECRET')
    MICROSOFT_SCOPE: kv.getSecret('MICROSOFT-SCOPE')
    MICROSOFT_TOKEN_URL: kv.getSecret('MICROSOFT-TOKEN-URL')
    MICROSOFT_USER_INFO_URL: kv.getSecret('MICROSOFT-USER-INFO-URL')
    OPENAI_API_KEY: kv.getSecret('OPENAI-API-KEY')
    POSTGRES_DB: kv.getSecret('POSTGRES-DB')
    POSTGRES_PASSWORD: kv.getSecret('POSTGRES-PASSWORD')
    POSTGRES_USER: kv.getSecret('POSTGRES-USER')
    POSTGRES_PORT: kv.getSecret('POSTGRES-PORT')
    REFRESH_TOKEN_SECRET: kv.getSecret('REFRESH-TOKEN-SECRET')
    STORAGE_ACCESS_KEY: kv.getSecret('STORAGE-ACCESS-KEY')
    STORAGE_BUCKET: kv.getSecret('STORAGE-BUCKET')
    STORAGE_ENDPOINT: kv.getSecret('STORAGE-ENDPOINT')
    STORAGE_PORT: kv.getSecret('STORAGE-PORT')
    STORAGE_REGION: kv.getSecret('STORAGE-REGION')
    STORAGE_SECRET_KEY: kv.getSecret('STORAGE-SECRET-KEY')
    STORAGE_SKIP_BUCKET_CHECK: kv.getSecret('STORAGE-SKIP-BUCKET-CHECK')
    STORAGE_URL: kv.getSecret('STORAGE-URL')
    STORAGE_USE_SSL: kv.getSecret('STORAGE-USE-SSL')
    WEBSITES_ENABLE_APP_SERVICE_STORAGE: kv.getSecret('WEBSITES-ENABLE-APP-SERVICE-STORAGE')
    XDT_MicrosoftApplicationInsights_Mode: kv.getSecret('XDT-MicrosoftApplicationInsights-Mode')
  }
}

module blobStorage './blob-storage.bicep' = {
  name: '${prefix}-${dockerTag}-storage'
  scope: rg
  params: {
    location: rg.location
    prefix: prefix
    dockerTag: dockerTag
  }
}

module chromio './chromio.bicep' = {
  name: '${prefix}-${dockerTag}-appserviceplan'
  scope: rg
  params: {
    prefix: prefix
    location: rg.location
    sku: sku
    CHROME_TOKEN: kv.getSecret('CHROME-TOKEN')
  }
}

module postgres './postgres.bicep' = {
  name: '${prefix}-${dockerTag}-postgres'
  scope: rg
  params: {
    prefix: prefix
    dockerTag: dockerTag
    postgresVersion: '16'
    POSTGRES_USER: kv.getSecret('POSTGRES-USER')
    POSTGRES_PASSWORD: kv.getSecret('POSTGRES-PASSWORD')
  }
}
