let conversationId = null

// create a chat widget
const ChatIconDiv = document.createElement("div")
ChatIconDiv.id = "chat-icon"
ChatIconDiv.style="position: fixed; bottom: 20px; right: 20px; background-color: orange; padding: 10px; border-radius: 50%;"
ChatIconDiv.innerHTML = `
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddrqlyqmv/image/upload/v1739771706/ai-technology_up8sr1.png"/>
`

const ChatContainerUI = document.createElement("div")

ChatContainerUI.id = "chat-widget-chat-container"

ChatContainerUI.style="position: fixed; bottom: 20px; right: 20px; background-color: aqua; width: 250px;"

ChatContainerUI.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;"><h6>Welcome to Geeki AI</h6></div>
    <div id="messages-container" style="display:flex; flex-direction : column; width:100%; flex-grow: 1; overflow-y: auto; padding: 5px; height: 300px; background-color: yellow;">
    </div>
    <div style="display: flex;">
        <div style="width : 100%;">
            <input id="chat-widget-input" style="width:100%; padding:4px;" placeholder="Reply here..." type="text"/>
        </div>
    </div>
    <div style="position: absolute; top: -30px; right: 0px;"><button id="close-chat-widget-chat-container-btn">Close</button></div>
`

// add chat widget into the client's website body
const ClientWebsiteBody = document.querySelector("body")
ClientWebsiteBody.appendChild(ChatIconDiv)


ChatIconDiv.addEventListener("click",(e)=>{

    document.getElementById("chat-icon").remove()
    
    ClientWebsiteBody.append(ChatContainerUI)

    sendMessage("Hello I am Geeki - AI Powered Assistant,<br> how i can help you?", true)

    document.getElementById("chat-widget-input").addEventListener("keypress",(event)=>{
        if (event.key === "Enter") { // Check if Enter key is pressed
            event.preventDefault();  // Prevent form submission (if inside a form)
            SubmitHandler()
        }
    })

    document.getElementById("close-chat-widget-chat-container-btn").addEventListener("click", ()=>{
        document.getElementById("messages-container").innerHTML=""
        conversationId=null
        document.getElementById("chat-widget-chat-container").remove()
        ClientWebsiteBody.appendChild(ChatIconDiv)
    })
})

async function SubmitHandler(){

    const query = document.getElementById("chat-widget-input").value
    document.getElementById("chat-widget-input").value = ""

    sendMessage(query, false)

    // using query we have to call the api
    const API_URL = "https://ai-search-project.geekashram.in/api/v1/query"
    const payload = {
        query : query
    }

    console.log(conversationId)

    if(conversationId){
        payload['queryId'] = conversationId
    }

    console.log(payload)

    const config = {
        method : "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify(payload)
    }
    const data = await fetch(API_URL, config).then(res=>res.json())
    const {success, data : {answer, queryId, references}} = data

    if(success){
        const botResponse = `
        ${answer}
        <br>
        <b style="font-size:12px;">References:</b>
        <br>
        ${references.map((reference)=>`<a style="font-size:10px;" href="${reference.url}" target="_blank"> ${reference.name}</a><br>`)}
        `
        sendMessage(botResponse, true)
        conversationId = queryId
    }

}


function sendMessage(text, isBotMessage){

    const messagesContainer = document.getElementById("messages-container")

    if(isBotMessage){
        // It's bot message i.e. Answer
        const botMessage = document.createElement("div")
        botMessage.style = "padding: 8px; margin: 5px; border-radius: 5px; max-width: 80%;  background-color: #f1f1f1;  align-self: flex-start;"
        botMessage.innerHTML = text
        messagesContainer.appendChild(botMessage)
    }else{
        // It's user message i.e. Query asked by the user
        const userMessage = document.createElement("div")
        userMessage.style = "padding: 8px; margin: 5px; border-radius: 5px; max-width: 80%;  background-color: #007bff; color: white; align-self: flex-end;"
        userMessage.innerHTML = text
        messagesContainer.appendChild(userMessage)
    }
}