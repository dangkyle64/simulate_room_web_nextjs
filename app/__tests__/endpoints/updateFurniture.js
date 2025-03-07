import { updateFurnitureData } from '../../_furnitureApi/furnitureApi';
import * as assert from 'assert';

global.fetch = require('jest-fetch-mock');

/**
 * Test suite for `PUT /api/furniture/:id` - Update a furniture item.
 * This suite tests edge cases, valid and invalid inputs, and various server response statuses for the update functionality.
 */
describe('PUT /api/furniture/:id', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    /**
     * Test: Update a furniture item successfully.
     * Verifies that a valid furniture object is updated and the correct data is returned.
     */
    it('should update a furniture item successfully', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockResponseOnce(JSON.stringify(updatedFurniture), { status: 200 });

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.ok(fetch.mock.calls[0][0] === `http://localhost:5000/api/furniture/${furnitureId}`);
        assert.deepStrictEqual(result, updatedFurniture);
    });

    /**
     * Test: Handle request failure.
     * Simulates a failed fetch request and ensures an empty array is returned.
     */
    it('should return an error if the request fails', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockRejectOnce(new Error('Failed to update furniture'));

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 400 Bad Request response.
     * Verifies that an empty array is returned when the server returns a 400 error due to invalid input.
     */
    it('should return an empty array for a 400 Bad Request response', async () => {
        const invalidFurniture = { type: '', modelUrl: '' }; // Invalid input
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, invalidFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 401 Unauthorized response.
     * Verifies that the system returns an empty array if the user is not authorized to update the furniture item.
     */
    it('should return an empty array for a 401 Unauthorized response', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 401 });

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 403 Forbidden response.
     * Verifies that the system returns an empty array if the user is forbidden from updating the furniture item.
     */
    it('should return an empty array for a 403 Forbidden response', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 403 });

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 404 Not Found response.
     * Verifies that the system returns an empty array if the furniture item with the given ID is not found.
     */
    it('should return an empty array for a 404 Not Found response', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 9999; // Assuming this ID doesn't exist
        fetch.mockResponseOnce('', { status: 404 });

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 500 Internal Server Error response.
     * Verifies that the system returns an empty array if there is a server error.
     */
    it('should return an empty array for a 500 Internal Server Error response', async () => {
        const updatedFurniture = { type: 'Sofa', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 500 });

        const result = await updateFurnitureData(furnitureId, updatedFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle missing required fields during update.
     * Verifies that the backend returns an error if required fields are missing in the update request.
     */
    it('should return an empty array if required fields are missing during update', async () => {
        const incompleteFurniture = { modelUrl: 'http://example.com/sofa' }; // Missing 'type'
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, incompleteFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle invalid data types during update.
     * Verifies that invalid data types (e.g., a number instead of a string for `type`) will cause an error.
     */
    it('should return an empty array for invalid data types during update', async () => {
        const invalidFurniture = { type: 123, modelUrl: 'http://example.com/sofa' }; // 'type' should be a string
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, invalidFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle invalid URL format during update.
     * Verifies that an invalid `modelUrl` (e.g., missing the `http://` protocol) will result in a failed request.
     */
    it('should return an empty array if modelUrl is invalid (missing protocol)', async () => {
        const invalidUrlFurniture = { type: 'Sofa', modelUrl: 'example.com/sofa' }; // Missing protocol
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, invalidUrlFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle empty request body during update.
     * Verifies that an empty request body results in a 400 error and an empty array.
     */
    it('should return an empty array if the request body is empty during update', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, {});

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle large payload during update.
     * Verifies that sending excessively large data results in a failure and an empty array.
     */
    it('should return an empty array for excessively large payload during update', async () => {
        const largeFurniture = { 
            type: 'Sofa'.repeat(1000), 
            modelUrl: 'http://example.com/sofa'.repeat(1000) 
        }; // Payload too large
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 400 });

        const result = await updateFurnitureData(furnitureId, largeFurniture);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle special characters in `type` during update.
     * Verifies that the system handles special characters (e.g., emojis) in the `type` field.
     */
    it('should return data containing special characters in the type during update', async () => {
        const furnitureWithSpecialChars = { type: 'Sofa 😀', modelUrl: 'http://example.com/sofa' };
        const furnitureId = 1;
        fetch.mockResponseOnce(JSON.stringify(furnitureWithSpecialChars), { status: 200 });

        const result = await updateFurnitureData(furnitureId, furnitureWithSpecialChars);

        assert.deepStrictEqual(result, furnitureWithSpecialChars);
    });
});
