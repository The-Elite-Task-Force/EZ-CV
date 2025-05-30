@description('keyVaultName is the name of the Key Vault where secrets will be stored and retrieved.')
@secure()
param keyVaultName string
@secure()
param prefix string = 'ezcv'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'

param location string = resourceGroup().location

@secure()
param POSTGRES_USER string
@secure()
param POSTGRES_PASSWORD string
param dbName string = 'ezcv-db'

param sku object = {
  name: 'Standard_B1ms'
  tier: 'Burstable'
}
param postgresVersion string = '16'





resource flexibleServers 'Microsoft.DBforPostgreSQL/flexibleServers@2024-11-01-preview' = {
  name: '${prefix}-${dockerTag}-postgres-db'
  location: resourceGroup().location
  sku: sku
  properties: {
    replica: {
      role: 'Primary'
    }
    storage: {
      iops: 120
      tier: 'P4'
      storageSizeGB: 32
      autoGrow: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
    dataEncryption: {
      type: 'SystemManaged'
    }
    authConfig: {
      activeDirectoryAuth: 'Disabled'
      passwordAuth: 'Enabled'
    }
    version: postgresVersion
    administratorLogin: POSTGRES_USER
    administratorLoginPassword: POSTGRES_PASSWORD
    availabilityZone: '1'
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    maintenanceWindow: {
      customWindow: 'Disabled'
      dayOfWeek: 0
      startHour: 0
      startMinute: 0
    }
    replicationRole: 'Primary'
  }
}

// Add a database to the server
resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-11-01-preview' = {
  name: dbName
  parent: flexibleServers
  properties: {
    charset: 'UTF8'
    collation: 'en_US.UTF8'
  }
}


// retrieve the Key Vault resource
resource kv 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

// Save connection string in Key Vault
resource postgresUrlSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'DATABASE-URL'
  properties: {
    value: 'Server=${flexibleServers.name}.postgres.database.azure.com;Database=${dbName};User Id=${POSTGRES_USER}@${flexibleServers.name};Password=${POSTGRES_PASSWORD};Ssl Mode=Require;'
  }
  dependsOn: [
    kv
  ]
}

// Save the Postgres password in Key Vault
resource postgresPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'POSTGRES-PASSWORD'
  properties: {
    value: POSTGRES_PASSWORD
  }
  dependsOn: [
    kv
    flexibleServers
  ]
}
// Save the Postgres username in Key Vault
resource postgresUsernameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'POSTGRES-USER'
  properties: {
    value: POSTGRES_USER
  }
  dependsOn: [
    kv
    flexibleServers
  ]
}

// Save the Postgres database name in Key Vault
resource postgresDatabaseNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'POSTGRES-DB'
  properties: {
    value: dbName
  }
  dependsOn: [
    kv
    flexibleServers
  ]
}

// Save the Postgres port in Key Vault
resource postgresPortSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'POSTGRES-PORT'
  properties: {
    value: '5432'
  }
  dependsOn: [
    kv
    flexibleServers
  ]
}

output connectionString string = 'Server=${flexibleServers.name}.postgres.database.azure.com;Database=${dbName};User Id=${POSTGRES_USER}@${flexibleServers.name};Password=${POSTGRES_PASSWORD};Ssl Mode=Require;'






