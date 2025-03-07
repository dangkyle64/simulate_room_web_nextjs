import { deleteFurnitureData } from '../../_furnitureApi/furnitureApi';
import * as assert from 'assert';

global.fetch = require('jest-fetch-mock');

/**
 * Test suite for `DELETE /api/furniture/:id` - Delete a furniture item.
 * This suite tests edge cases, valid and invalid inputs, and various server response statuses for the delete functionality.
 */
describe('DELETE /api/furniture/:id', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    /**
     * Test: Successfully delete a furniture item.
     * Verifies that a furniture item is successfully deleted.
     */
    it('should delete a furniture item successfully', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 200 });

        const result = await deleteFurnitureData(furnitureId);

        assert.ok(fetch.mock.calls[0][0] === `http://localhost:5000/api/furniture/${furnitureId}`);
        assert.deepStrictEqual(result, []);  // Assuming empty array is returned on success
    });

    /**
     * Test: Handle request failure during delete.
     * Simulates a failed fetch request and ensures an empty array is returned.
     */
    it('should return an empty array if the request fails', async () => {
        const furnitureId = 1;
        fetch.mockRejectOnce(new Error('Failed to delete furniture'));

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 400 Bad Request response during delete.
     * Verifies that the system returns an empty array when invalid data is sent (e.g., invalid ID).
     */
    it('should return an empty array for a 400 Bad Request response', async () => {
        const furnitureId = 'invalid_id'; // Invalid ID format
        fetch.mockResponseOnce('', { status: 400 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 401 Unauthorized response during delete.
     * Verifies that an empty array is returned if the user is unauthorized to delete the furniture item.
     */
    it('should return an empty array for a 401 Unauthorized response', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 401 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 403 Forbidden response during delete.
     * Verifies that the system returns an empty array if the user is forbidden from deleting the furniture item.
     */
    it('should return an empty array for a 403 Forbidden response', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 403 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 404 Not Found response during delete.
     * Verifies that the system returns an empty array when the furniture item with the given ID is not found.
     */
    it('should return an empty array for a 404 Not Found response', async () => {
        const furnitureId = 9999; // Assuming this ID doesn't exist
        fetch.mockResponseOnce('', { status: 404 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle 500 Internal Server Error response during delete.
     * Verifies that the system returns an empty array when the server encounters an error.
     */
    it('should return an empty array for a 500 Internal Server Error response', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 500 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle an empty response body during delete.
     * Verifies that the system returns an empty array if the server responds with an empty body but a successful status code.
     */
    it('should return an empty array if the response body is empty', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 200 });

        const result = await deleteFurnitureData(furnitureId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle invalid ID type during delete.
     * Verifies that the system handles an invalid ID type (e.g., a non-numeric string) correctly.
     */
    it('should return an empty array for invalid ID type during delete', async () => {
        const invalidId = 'abc'; // Invalid ID format
        fetch.mockResponseOnce('', { status: 400 });

        const result = await deleteFurnitureData(invalidId);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle special characters in ID during delete.
     * Verifies that the system can handle furniture IDs containing special characters.
     */
    it('should return an empty array for invalid IDs with special characters during delete', async () => {
        const invalidIdWithSpecialChars = 'furniture-@123'; // Special characters in ID
        fetch.mockResponseOnce('', { status: 400 });

        const result = await deleteFurnitureData(invalidIdWithSpecialChars);

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle missing ID during delete.
     * Verifies that an empty array is returned when no ID is provided for deletion.
     */
    it('should return an empty array if no ID is provided during delete', async () => {
        fetch.mockResponseOnce('', { status: 400 });

        const result = await deleteFurnitureData(); // No ID

        assert.deepStrictEqual(result, []);
    });

    /**
     * Test: Handle large number of concurrent delete requests.
     * Simulates the behavior of the delete endpoint when there are a large number of concurrent delete requests.
     */
    it('should handle a large number of concurrent delete requests', async () => {
        const furnitureId = 1;
        fetch.mockResponseOnce('', { status: 200 });

        // Simulating a high volume of concurrent requests
        const promises = Array(1000).fill(null).map(() => deleteFurnitureData(furnitureId));
        const results = await Promise.all(promises);

        // Ensure all requests return an empty array (or successful status with no response body)
        results.forEach(result => {
            assert.deepStrictEqual(result, []);
        });
    });
});
