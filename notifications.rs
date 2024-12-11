mod notifications {
    use std::{env, thread, time};
    use std::error::Error;

    pub fn process_new_post(post_title: &str, post_content: &str) -> Result<(), Box<dyn Error>> {
        println!("Processing new post notification...");
        println!("New post created: {} - {}", post_title, post_content);
        send_notification("New Post:", post_title)?;
        Ok(())
    }

    pub fn process_updated_post(post_title: &str, post_content: &str) -> Result<(), Box<dyn Error>> {
        println!("Processing updated post notification...");
        println!("Post updated: {} - {}", post_title, post_content);
        send_notification("Updated Post:", post_title)?;
        Ok(())
    }

    pub fn schedule_future_notification(post_title: &str, delay_seconds: u64) -> Result<(), Box<dyn Error>> {
        println!("Scheduling future notification for post: {}", post_title);
        let pause_time = time::Duration::new(delay_seconds, 0);
        thread::sleep(pause_time);
        send_notification("Scheduled Post:", post_title)?;
        Ok(())
    }

    fn send_notification(prefix: &str, post_title: &str) -> Result<(), Box<dyn Error>> {
        let notification_service_endpoint = env::var("NOTIFICATION_SERVICE_ENDPOINT")
            .unwrap_or_else(|_| String::from("http://localhost:3000/send"));
        println!("Sending notification to {}: {} {}", notification_service_endpoint, prefix, post_title);
        Ok(())
    }
}

fn main() {
    if let Err(e) = notifications::process_new_post("Hello, Rust!", "This is a new post about Rust.") {
        eprintln!("Error processing new post: {}", e);
    }
    if let Err(e) = notifications::process_updated_post("Hello, Rust!", "This post about Rust has been updated.") {
        eprintln!("Error processing updated post: {}", e);
    }
    if let Err(e) = notifications::schedule_future_notification("Future Post: Learn Async in Rust", 5) {
        eprintln!("Error scheduling future notification: {}", e);
    }
}