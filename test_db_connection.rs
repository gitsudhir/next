use postgres_native_tls::MakeTlsConnector;
use native_tls::TlsConnector;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get database connection string from environment variables
    let database_url = env::var("POSTGRES_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| "Database URL not found in environment variables")?;
    
    println!("Attempting to connect to: {}", database_url);
    
    // Create TLS connector
    let connector = TlsConnector::new()?;
    let connector = MakeTlsConnector::new(connector);
    
    // Connect to the database
    match tokio_postgres::connect(&database_url, connector).await {
        Ok((client, connection)) => {
            println!("Successfully connected to database");
            
            // Spawn the connection to run in the background
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Database connection error: {}", e);
                }
            });
            
            // Test query
            match client.query("SELECT version()", &[]).await {
                Ok(rows) => {
                    for row in rows {
                        let version: String = row.get(0);
                        println!("Database version: {}", version);
                    }
                }
                Err(e) => {
                    eprintln!("Query error: {}", e);
                }
            }
            
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to connect to database: {}", e);
            Err(e.into())
        }
    }
}