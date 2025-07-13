// Mock for nanoid to provide consistent test IDs
const mockNanoid = jest.fn(() => 'test-nanoid-id');

// Mock both named and default exports
module.exports = {
  nanoid: mockNanoid,
  __esModule: true,
  default: mockNanoid,
};

// For ES modules compatibility
module.exports.nanoid = mockNanoid;
