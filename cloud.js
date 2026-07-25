const supabaseUrl = "https://fpjacflqckepjqehwqvu.supabase.co";
const supabaseKey = "sb_publishable_a2FHOxYomSmJfog6q9Knyw_MYsLbKoI";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);
const sendBtn = document.getElementById("sendBtn");
let lastSent = 0;



sendBtn.addEventListener("click", async () => {
  const now = Date.now();

    if (now - lastSent < 30000) {
        alert("dont be jerk and spam be kind");
        return;
    }

    lastSent = now;
   


    const message = document.getElementById("message").value;

    const { data, error } = await supabaseClient
        .from("site_messages")
        .insert([
            {
                message: message
            }
        ]);

    if(error){

        console.log(error);

        alert("Failed to send");

    }else{

        alert("Message sent!");

    }

});

