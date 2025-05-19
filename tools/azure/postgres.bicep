@secure()
param POSTGRES_USER string
@secure()
param POSTGRES_PASSWORD string
param dbName string = 'ezcv-db'
param prefix string = 'ezcv'
param sku object = {
  name: 'Standard_B1ms'
  tier: 'Burstable'
}
param postgresVersion string = '16'
@allowed([
  'latest'
  'beta'
  'prod'
])
param dockerTag string = 'latest'




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

output connectionString string = 'postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${flexibleServers.name}.postgres.database.azure.com:5432/${dbName}?sslmode=require'
