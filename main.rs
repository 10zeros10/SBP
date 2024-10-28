use std::env;
use dotenv::dotenv;

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

fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_notifier()?;
    start_processing()?;
    println!("Processing completed successfully.");
    Ok(())
}