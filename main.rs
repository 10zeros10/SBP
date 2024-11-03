use std::{collections::HashMap, hash::Hash, sync::Mutex};
use std::env;
use dotenv::dotenv;
use lazy_static::lazy_static;

fn post_notification(message: &str) {
    println!("Notification posted: {}", message);
}

#[derive(Debug)]
enum AppError {
    Dotenv(dotenv::Error),
    EnvVar(std::env::VarError),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            AppError::Dotenv(ref err) => write!(f, "dotenv error: {}", err),
            AppError::EnvVar(ref err) => write!(f, "environment variable error: {}", err),
        }
    }
}

impl std::error::Error for AppError {}

impl From<dotenv::Error> for AppError {
    fn from(err: dotenv::Error) -> AppError {
        AppError::Dotenv(err)
    }
}

impl From<std::env::VarError> for AppError {
    fn from(err: std::env::VarError) -> AppError {
        AppError::EnvVar(err)
    }
}

fn init_notifier() -> Result<(), AppError> {
    dotenv().map_err(AppError::from)?;
    println!("Notifier initialized with environment settings.");
    Ok(())
}

fn start_processing() -> Result<(), AppError> {
    let notification_message = env::var("NOTIFICATION_MESSAGE")?;
    post_notification(&notification_message);
    Ok(())
}

// Memoization utility
lazy_static! {
    static ref CACHE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}

fn cached_env_var(key: &str) -> Result<String, AppError> {
    let mut cache = CACHE.lock().unwrap();
    if let Some(value) = cache.get(key) {
        return Ok(value.clone());
    }
    let value = env::var(key)?;
    cache.insert(key.to_string(), value.clone());
    Ok(value)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_notifier()?;
    // Now using cached_env_var instead of direct env::var call
    let notification_message = cached_env_var("NOTIFICATION_MESSAGE")?;
    post_notification(&notification_message);
    println!("Processing completed successfully.");
    Ok(())
}