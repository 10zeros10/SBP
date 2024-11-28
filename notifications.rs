mod notifications {
    use std::env;

    pub fn process_new_post(post_title: &str, post_content: &str) {
        println!("Processing new post notification...");
        println!("New post created: {} - {}", post_title, post_content);
        // Avoid creating a new String for the message unless necessary
        send_notification("New Post:", post_title);
    }

    pub fn process_updated_post(post_title: &str, post_content: &str) {
        println!("Processing updated post notification...");
        println!("Post updated: {} - {}", post_title, post_content);
        // Avoid creating a new String for the message unless necessary
        send_notification("Updated Post:", post_title);
    }

    fn send_notification(prefix: &str, post_title: &str) {
        let notification_service_endpoint = env::var("NOTIFICATION_SERVICE_ENDPOINT")
            .unwrap_or_else(|_| String::from("http://localhost:3000/send"));
        println!("Sending notification to {}: {} {}", notification_service_endpoint, prefix, post_title);
        // Actual send implementation here (omitted for brevity)
    }
}

fn main() {
    notifications::process_new_post("Hello, Rust!", "This is a new post about Rust.");
    notifications::process_updated_post("Hello, Rust!", "This post about Rust has been updated.");
}