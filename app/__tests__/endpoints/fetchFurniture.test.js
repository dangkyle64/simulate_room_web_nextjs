const { fetchFurnitureData } = require('../../_furnitureApi/furnitureApi');
const assert = require('assert');

global.fetch = require('jest-fetch-mock');

describe('API Fetch', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    /**
     * Tests successful fetch operation.
     * @test
     * @description fetchFurnitureData should return data when the fetch is successful.
     * @returns {void}
     */
    it('fetchFurnitureData should return data when the fetch is successful', async () => {
        const mockData = [
            { id: 1, type: 'Chair' },
            { id: 2, type: 'Table' }
        ];

        fetch.mockResponseOnce(JSON.stringify(mockData));

        const result = await fetchFurnitureData();

        assert.ok(fetch.mock.calls[0][0] === 'http://localhost:5000/api/furniture/');

        assert.deepStrictEqual(result, mockData);
    });

    /**
     * Tests behavior when there is an error in fetching the data.
     * @test
     * @description fetchFurnitureData should return an empty array when there is an error.
     * @returns {void}
     */
    it('fetchFurnitureData should return an empty array when there is an error', async () => {
        fetch.mockRejectOnce(new Error('Failed to fetch data'));

        const result = await fetchFurnitureData();

        assert.deepStrictEqual(result, []);
    });

    /**
     * Simulates a network failure and tests the response.
     * @test
     * @description Should return an empty array when network is down.
     * @returns {void}
     */
    it('should return an empty array when network is down', async () => {
        fetch.mockRejectOnce(new Error('Network Error'));
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); // Expect empty array
    });

    /**
     * Simulates a timeout scenario in the API request.
     * @test
     * @description Should return an empty array if the request times out.
     * @returns {void}
     */
    it('should return an empty array if the request times out', async () => {
        fetch.mockImplementationOnce(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
        );
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); 
    });

    /**
     * Simulates an error response (500 Internal Server Error).
     * @test
     * @description fetchFurnitureData should return an empty array on error response.
     * @returns {void}
     */
    it('should return an empty array for a 404 Not Found response', async () => {
        fetch.mockResponseOnce('', { status: 404 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); 
    });

    /**
     * Simulates a service unavailable error (503).
     * @test
     * @description Should return an empty array if the server is unavailable (503).
     * @returns {void}
     */
    it('fetchFurnitureData should return an empty array on error response', async () => {
        fetch.mockResponseOnce('', { status: 500 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []);
    });

    /**
     * Simulates a service unavailable error (503).
     * @test
     * @description Should return an empty array if the server is unavailable (503).
     * @returns {void}
     */
    it('should return an empty array if the server is unavailable (503)', async () => {
        fetch.mockResponseOnce('', { status: 503 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); 
    });    

    /**
     * Simulates a response with an empty body (200 OK but no content).
     * @test
     * @description Should return an empty array if the server responds with an empty body.
     * @returns {void}
     */
    it('should return an empty array if the server responds with empty body', async () => {
        fetch.mockResponseOnce('', { status: 200 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); 
    });
    
    /**
     * Simulates an invalid JSON response.
     * @test
     * @description Should return an empty array if the server returns invalid JSON.
     * @returns {void}
     */
    it('should return an empty array if the server returns invalid JSON', async () => {
        fetch.mockResponseOnce('{"invalidJson"', { status: 200 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, []); 
    });

    /**
     * Simulates a response with special characters in the data.
     * @test
     * @description Should return data containing special characters.
     * @returns {void}
     */
    it('should return data containing special characters', async () => {
        const responseData = [{ name: 'Chair 😀', type: 'Furniture' }];
        fetch.mockResponseOnce(JSON.stringify(responseData), { status: 200 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, responseData); 
    });
    
    /**
     * Simulates handling a large response payload.
     * @test
     * @description Should handle large response data.
     * @returns {void}
     */
    it('should handle large response data', async () => {
        const largeData = new Array(10000).fill({ name: 'Chair', type: 'Furniture' });
        fetch.mockResponseOnce(JSON.stringify(largeData), { status: 200 });
    
        const result = await fetchFurnitureData();
    
        assert.deepStrictEqual(result, largeData); 
    });
});