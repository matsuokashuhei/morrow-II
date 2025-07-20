// Mock for environment.ts to avoid import.meta issues in Jest
module.exports = {
  getApiBaseUrl: () => process.env.API_BASE_URL || 'http://localhost:8080',
  getGraphQLEndpoint: () =>
    process.env.GRAPHQL_ENDPOINT || 'http://localhost:8080/query',
};
