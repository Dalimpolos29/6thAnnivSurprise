document.getElementById("form").addEventListener("submit", auth);

function auth(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "050218" && password === "Deanna_0502") {
        window.location.replace("https://www.facebook.com/");
    } else {
        // Display pop-up with the message
        var popup = document.createElement("div");
        popup.className = "popup";
        popup.textContent = "Sure Kana Diyan?";
        document.body.appendChild(popup);

        // Remove the pop-up after 3 seconds
        setTimeout(function() {
            popup.remove();
        }, 5000);

        return;
    }
}
