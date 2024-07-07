<?php
require_once __DIR__ . '/../config/db.php';

// Get collection name from environment variables
$collectionName = getenv('COLLECTION_NAME');

try {
    // Get MongoDB collection
    $collection = getMongoDBCollection($collectionName);

    // Retrieve all documents from the collection
    $documents = $collection->find();

    $result = [];

    // Iterate over the cursor and store documents in the result array
    foreach ($documents as $document) {
        // Optionally, you can manipulate or process each document here
        $result[] = $document;
    }

    // Send the documents as a JSON response
    header('Content-Type: application/json');
    echo json_encode($result);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
