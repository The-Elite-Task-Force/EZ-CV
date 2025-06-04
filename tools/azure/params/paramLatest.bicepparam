using './../main.bicep'

param prefix = 'ezcv'
param dockerTag = 'latest'
param sku = 'Standard'
param subscriptionId = 'd3730832-4250-4e51-b454-680e31182cd4'

// replacement for the following parameters with actual values
param POSTGRES_USER  = 'postgres'
param POSTGRES_PASSWORD = 'postgres'
param CHROME_TOKEN = 'chrome_token'

param DOCKER_REGISTRY_SERVER_USERNAME = 'myUsername'
param DOCKER_REGISTRY_SERVER_PASSWORD = 'myPassword'

param GrafanaAdminPassword = 'GrafanaAdminPassword'
param ACCESS_TOKEN_SECRET = 'my_access_token_secret'
param REFRESH_TOKEN_SECRET = 'my_refresh_token_secret'
