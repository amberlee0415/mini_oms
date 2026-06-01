import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '../../../../data');

/**
 * Read JSON data from a file with robust error handling
 * @param {string} filename - Name of the file (e.g., 'products.json')
 * @returns {Promise<Array>} - Parsed JSON data or empty array on error
 * 
 * Handles:
 * - File not found (ENOENT) → returns []
 * - Empty file → returns []
 * - Invalid JSON → returns [] and logs error
 * - Other errors → returns [] and logs error
 */
export const readJson = async (filename) => {
  try {
    const filePath = join(DATA_DIR, filename);
    const fileContent = await readFile(filePath, 'utf-8');
    
    // Handle empty file
    if (!fileContent || fileContent.trim() === '') {
      console.warn(`[fileStorage] File ${filename} is empty, returning empty array`);
      return [];
    }
    
    // Parse JSON with error handling
    try {
      const parsedData = JSON.parse(fileContent);
      
      // Ensure we always return an array
      if (!Array.isArray(parsedData)) {
        console.warn(`[fileStorage] File ${filename} does not contain an array, returning empty array`);
        return [];
      }
      
      return parsedData;
    } catch (parseError) {
      // JSON parsing failed - file is corrupted
      console.error(`[fileStorage] Invalid JSON in ${filename}:`, parseError.message);
      return [];
    }
  } catch (error) {
    // File not found - this is expected for new files
    if (error.code === 'ENOENT') {
      console.info(`[fileStorage] File ${filename} not found, returning empty array`);
      return [];
    }
    
    // Other file system errors
    console.error(`[fileStorage] Error reading ${filename}:`, error.message);
    return [];
  }
};

/**
 * Write JSON data to a file with robust error handling
 * @param {string} filename - Name of the file (e.g., 'products.json')
 * @param {Array|Object} data - Data to write (will be stringified)
 * @returns {Promise<boolean>} - true if successful, false otherwise
 * 
 * Handles:
 * - Invalid data (non-serializable) → logs error and returns false
 * - File system errors → logs error and returns false
 * - Success → returns true
 */
export const writeJson = async (filename, data) => {
  try {
    const filePath = join(DATA_DIR, filename);
    
    // Validate data can be stringified
    let jsonString;
    try {
      jsonString = JSON.stringify(data, null, 2);
    } catch (stringifyError) {
      console.error(`[fileStorage] Cannot stringify data for ${filename}:`, stringifyError.message);
      return false;
    }
    
    // Write to file
    await writeFile(filePath, jsonString, 'utf-8');
    console.info(`[fileStorage] Successfully wrote to ${filename}`);
    return true;
  } catch (error) {
    console.error(`[fileStorage] Error writing to ${filename}:`, error.message);
    return false;
  }
};

// Legacy functions for backward compatibility
export const readData = readJson;
export const writeData = writeJson;
