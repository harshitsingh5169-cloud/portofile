const supabaseUrl = "https://fpjacflqckepjqehwqvu.supabase.co";
const supabaseKey = "sb_publishable_a2FHOxYomSmJfog6q9Knyw_MYsLbKoI";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);
const sendBtn = document.getElementById("sendBtn");
let lastSent = 0;



sendBtn.addEventListener("click", async () => {
    const messageInput = document.getElementById("message");
    
    // 👇 .trim() removes all accidental or malicious empty spaces
    const message = messageInput.value.trim(); 

    // 1. Instantly stop the function if the box is empty
    if (message.length === 0) {
        alert("You cannot send an empty message!");
        return; // Stops the code from running further
    }

    // 2. Your existing spam countdown check
    const now = Date.now();
    if (now - lastSent < 30000) {
        alert("dont be jerk and spam be kind");
        return;
    }

    lastSent = now;

    // 3. Send the cleaned message to Supabase
    const { data, error } = await supabaseClient
        .from("site_messages")
        .insert([{ message: message }]);

    if (error) {
        console.log(error);
        alert("Failed to send");
    } else {
        alert("Message sent!");
        messageInput.value = ""; // Clear the input box for the next message
    }
});
