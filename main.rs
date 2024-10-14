use std::env;
use dotenv::dotenv;

fn post_notification(message: &str) {
    println!("Notification posted: {}", message);
}

fn init_notifier() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    println!("Notifier initialized with environment settings.");
    Ok(())
}

fn start_processing() -> Result<(), Box<dyn std::error::Error>> {
    let notification_message = env::var("NOTIFICATION_MESSAGE").expect("NOTIFICATION_MESSAGE must be set");
    post_notification(&notification_message);
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_notifier()?;
    start_processing()?;
    Ok(())
}