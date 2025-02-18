const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://craftymet:TzT9DNPZKhpTKSjL@cluster0.huv4f.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function uploadData() {
    try {
        // Connect the client to the server
        await client.connect();
        const db = client.db("anouncements_db"); // Database name
        const collection = db.collection("posts"); // Collection name

        // Create a document to insert
        const newPost = {
            date: new Date(),
            content: document.getElementById('paragraph').value
        };

        // Insert the document
        const result = await collection.insertOne(newPost);
        console.log(`Post inserted with ID: ${result.insertedId}`);
    } catch (err) {
        console.error("Error inserting data:", err);
    } finally {
        // Close the client after operation is done
        await client.close();
    }
}

// admin account access
function adminAccount(event) {
    event.preventDefault();
    if (document.getElementById('username').value == "admin" && document.getElementById('password').value == "qwerty") {
        window.location.href = "/html/adminDashboard.html";
        console.log("Redirecting to dashboard...");
    }
}

