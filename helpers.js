const fs = require('fs').promises;
const crypto = require('crypto');

// Check if the url in the request object is valid regex
function isValidUrl(url) {
  const regex = /^[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/;
  return regex.test(url);
}

// Create and attach a 10 digit alphanumeric string to url
function shortenUrl(url) {
  let randomHex = crypto.randomBytes(5).toString("hex");
  return `${url}/${randomHex}`
}

// Read the data file
async function readFile(filePath) {
  try {
    let data = await fs.readFile(filePath)
    return JSON.parse(data)
  } catch (error) { // If the file does not exist, throw error
    console.log('No such record has been created')
    throw error;
  }
}

// Check if the data file exists and if not, create one with an empty object
async function checkReadOrCreateFile(filePath) {
  try {
    let data = await fs.readFile(filePath)
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('File does not exist, creating file with empty object.');
      const initialData = JSON.stringify({});
      fs.writeFile(filePath, initialData, 'utf8');
      return {};
    }
    throw error
  }
}

// Save data to the data file
async function saveData(data, filePath) {
  try {
    const dataString = JSON.stringify(data); // Convert data to a JSON string
    await fs.writeFile(filePath, dataString); // Write the data to a file
    console.log('Data saved successfully.');
    return "success"
  } catch (error) {
    console.error('Failed to save data:', error);
    return error
  }
}

module.exports = { saveData, checkReadOrCreateFile, readFile, shortenUrl, isValidUrl };
