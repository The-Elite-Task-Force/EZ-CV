param location string = resourceGroup().location
param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'
param sku object = {
  name: 'Standard_LRS'
  tier: 'Standard'
}

@description('Key Vault Name')
param keyVaultName string

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

var name = '${prefix}${dockerTag}blobstorage'

resource storageAccounts_sta_resource 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: name
  location: location
  sku: sku
  kind: 'StorageV2'
  properties: {
    dnsEndpointType: 'Standard'
    defaultToOAuthAuthentication: false
    publicNetworkAccess: 'Enabled'
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    largeFileSharesState: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      requireInfrastructureEncryption: false
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource blob_sta_default 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccounts_sta_resource
  name: 'default'
  properties: {
    containerDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
    cors: {
      corsRules: []
    }
    deleteRetentionPolicy: {
      allowPermanentDelete: false
      enabled: true
      days: 7
    }
  }
}

resource fileServices_sta_default 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  parent: storageAccounts_sta_resource
  name: 'default'
  properties: {
    protocolSettings: {
      smb: {}
    }
    cors: {
      corsRules: []
    }
    shareDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource queueServices_sta_default 'Microsoft.Storage/storageAccounts/queueServices@2023-05-01' = {
  parent: storageAccounts_sta_resource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource tableService_sta_default 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  parent: storageAccounts_sta_resource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

//Creata a container for images in the blob storage
resource images 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blob_sta_default
  name: 'images'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'Blob'
  }
}

// Create a container for logging in the blob storage
resource logs 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blob_sta_default
  name: 'logging'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'Blob'
  }
}

// Save the storage account key in Key Vault
resource storageAccountKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AZURE-ACCOUNT-KEY'
  properties: {
    value: storageAccounts_sta_resource.listKeys().keys[0].value
  }
  dependsOn: [
    kv
  ]
}

//Save the storage account name in Key Vault
resource storageAccountNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AZURE-ACCOUNT-NAME'
  properties: {
    value: storageAccounts_sta_resource.name
  }
  dependsOn: [
    kv
  ]
}

//Save the container name in Key Vault
resource containerNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AZURE-STORAGE-CONTAINER'
  properties: {
    value: images.name
  }
  dependsOn: [
    kv
  ]
}
