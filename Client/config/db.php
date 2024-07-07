<?php
require_once __DIR__ . '/../vendor/autoload.php';
require __DIR__ . './dotenv.php';

// Load environment variables
loadEnv(__DIR__ . '/../.env');

// Function to establish MongoDB connection and retrieve collection
function getMongoDBCollection($collectionName) {
    $mongoUri = getenv('MONGODB_URI');
    $databaseName = getenv('DATABASE_NAME');
    
    try {
        $mongoClient = new MongoDB\Client($mongoUri);
        $database = $mongoClient->selectDatabase($databaseName);
        $collection = $database->selectCollection($collectionName);
        return $collection;
    } catch (Exception $e) {
        throw new Exception('Failed to connect to MongoDB: ' . $e->getMessage());
    }
}
?>
