import { createFurnitureData } from '../../_furnitureApi/furnitureApi';
import assert from 'assert';

global.fetch = require('jest-fetch-mock');

/**
 * Test suite for `POST /api/furniture/` - Create a new furniture item.
 * This suite tests edge cases, valid and invalid inputs, and various server response statuses.
 */
describe('POST /api/furniture/', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    /**
     * Test: Create a furniture item successfully.
     * Verifies that a valid furniture object is created and the correct data is returned.
     */
    it('should create a furniture item successfully', async () => {
        const newFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        fetch.mockResponseOnce(JSON.stringify(newFurniture), { status: 201 });

        const result = await createFurnitureData(newFurniture);

        assert.ok(fetch.mock.calls[0][0] === 'http://localhost:5000/api/furniture/');
        assert.deepStrictEqual(result, newFurniture);
    });

    /**
     * Test: Handle request failure.
     * Simulates a failed fetch request and ensures an empty array is returned.
     */
    it('should return an error if the request fails', async () => {
        const newFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        fetch.mockRejectOnce(new Error('Failed to create furniture'));

        const result = await createFurnitureData(newFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 400 Bad Request response.
     * Verifies that an empty array is returned when the server returns a 400 error.
     */
    it('should return an empty array for a 400 Bad Request response', async () => {
        const invalidFurniture = { type: '', modelUrl: '' }; // Invalid input
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(invalidFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 401 Unauthorized response.
     * Verifies that the system returns an empty array if the request is unauthorized.
     */
    it('should return an empty array for a 401 Unauthorized response', async () => {
        const newFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        fetch.mockResponseOnce('', { status: 401 });

        const result = await createFurnitureData(newFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 403 Forbidden response.
     * Verifies that the system returns an empty array if the user is forbidden from creating a new furniture item.
     */
    it('should return an empty array for a 403 Forbidden response', async () => {
        const newFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        fetch.mockResponseOnce('', { status: 403 });

        const result = await createFurnitureData(newFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle empty request body.
     * Ensures that the system handles an empty request body and returns an empty array.
     */
    it('should return an empty array if the payload is empty', async () => {
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData({});

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle missing required fields.
     * Verifies that missing required fields (e.g., 'type') return an empty array and status 400.
     */
    it('should return an empty array if required fields are missing', async () => {
        const incompleteFurniture = { modelUrl: 'http://example.com/sofa' }; // Missing 'type'
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(incompleteFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle invalid data types.
     * Verifies that the backend returns an error when invalid data types are provided (e.g., `type` as a number).
     */
    it('should return an empty array for invalid data types', async () => {
        const invalidFurniture = { type: 123, modelUrl: 'http://example.com/sofa' }; // 'type' should be a string
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(invalidFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle invalid `modelUrl`.
     * Verifies that the backend returns an error when the `modelUrl` is not a valid URL.
     */
    it('should return an empty array if modelUrl is invalid (not a URL)', async () => {
        const invalidUrlFurniture = { type: 'Sofa', modelUrl: 'not-a-url' }; // Invalid URL
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(invalidUrlFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle missing URL protocol in `modelUrl`.
     * Verifies that the backend returns an error when the URL is missing the protocol (e.g., `http://`).
     */
    it('should return an empty array if modelUrl is missing the protocol (e.g., http:// or https://)', async () => {
        const invalidUrlFurniture = { type: 'Sofa', modelUrl: 'example.com/sofa' }; // Missing protocol
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(invalidUrlFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle malformed JSON in the request body.
     * Verifies that the backend handles malformed JSON and returns an empty array.
     */
    it('should return an empty array for invalid JSON in the request body', async () => {
        const invalidJsonFurniture = '{ "type": "Sofa", "modelUrl": "http://example.com/sofa" '; // Missing closing brace
        fetch.mockResponseOnce(invalidJsonFurniture, { status: 400 });

        const result = await createFurnitureData(invalidJsonFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle large payloads.
     * Verifies that excessively large payloads return an error (400) and the system returns an empty array.
     */
    it('should return an empty array for excessively large payload', async () => {
        const largeFurniture = { 
            type: 'Sofa'.repeat(1000), 
            modelUrl: 'http://example.com/sofa'.repeat(1000) 
        }; // Payload too large
        fetch.mockResponseOnce('', { status: 400 });

        const result = await createFurnitureData(largeFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle special characters in the `type`.
     * Verifies that the system can handle special characters (like emojis) in the `type` field.
     */
    it('should return data containing special characters in the type', async () => {
        const furnitureWithSpecialChars = { type: 'Sofa 😀', modelUrl: 'http://example.com/sofa' };
        fetch.mockResponseOnce(JSON.stringify(furnitureWithSpecialChars), { status: 201 });

        const result = await createFurnitureData(furnitureWithSpecialChars);

        assert.deepStrictEqual(result, furnitureWithSpecialChars);
    });

    /**
     * Test: Handle internal server errors (500).
     * Simulates a 500 Internal Server Error and verifies that the system returns an empty array.
     */
    it('should return an empty array if the server returns an internal server error (500)', async () => {
        const newFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        fetch.mockResponseOnce('', { status: 500 });

        const result = await createFurnitureData(newFurniture);

        assert.deepStrictEqual(result, []);
    });
});
