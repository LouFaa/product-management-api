/**
 * Helper functions for database
 */

var mongoose = require("mongoose");

var is_connected = false;

/**
 * Open connection for the database
 */
function openConnection() {
  if (!is_connected)
    mongoose.connect("mongodb://127.0.0.1:27017/productdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,

      
    });
    mongoose.set('useCreateIndex', true)
  if (mongoose.connection) {
    is_connected = true;
  }
}

/**
 * Close the connection if it exists
 */
function closeConnection() {
  mongoose.connection.close();
  is_connected = false;
}

module.exports = {
  openConnection,
  closeConnection,
  is_connected
};
