mod notifications {
    use std::env;

    pub fn process_new_post(post_title: &str, post_content: &str) {
        println!("Processing new post notification...");
        println!("New post created: {} - {}", post_title, post_content);
        send_notification(format!("New Post: {}", post_title).as_str());
    }

    pub fn process_updated_post(post_title: &str, post_content: &str) {
        println!("Processing updated post notification...");
        println!("Post updated: {} - {}", post_title, post_content);
        send_notification(format!("Updated Post: {}", post_title).as_str());
    }

    fn send_notification(message: &str) {
        let notification_service_endpoint = env::var("NOTIFICATION_SERVICE_ENDPOINT").unwrap_or_else(|_| "http://localhost:3000/send".to_string());
        println!("Sending notification to {}: {}", notification_service_endpoint, message);
    }
}

fn main() {
    notifications::process_new_post("Hello, Rust!", "This is a new post about Rust.");
    notifications::process_updated_post("Hello, Rust!", "This post about Rust has been updated.");
}