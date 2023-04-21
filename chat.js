document.addEventListener('DOMContentLoaded', checkAuthentication);
const token = localStorage.getItem('token');
const chatForm = document.querySelector('#chat-form');
chatForm.addEventListener('submit', sendMessage);
let user;
const backend_url = 'http://localhost:3000';
let messages = 0

async function checkNewMessages(){
    try{
        let res = await axios.get(`${backend_url}/chat/new-messages/${messages}`, {headers: {"Authorization": token}});
        console.log(res.data.new_messages);
        return res.data.new_messages;
    }
    catch(err){
        showError(err.message);
    }
}
setInterval(async () => {

    let new_messages = await checkNewMessages();
    console.log(messages)
    if(new_messages!==undefined){
        messages = messages + new_messages.length;
        for(let i=0;i<new_messages.length;i++){
            createNewChat(new_messages[i]);
            scrollSmoothlyToBottom('chat-box');
        }
    }
}, 3000);

async function showError(err){
    let err_div = document.querySelector('#error');
    err_div.className = 'alert alert-danger';
    err_div.innerHTML = err;  
    $( "#error" ).fadeIn( 400 ).delay( 3000 ).fadeOut( 400 );

   if(token===null){
    await new Promise((res, rej) => {
        setTimeout(() => {
            res();
            window.location.href = './login.html';
        }, 3000);
    });
   }
}

const scrollSmoothlyToBottom = (id) => {
    const element = $(`#${id}`);
    element.animate({
        scrollTop: element.prop("scrollHeight")
    }, 2500);
}

async function checkAuthentication(){
    if(token === null)
        showError('Please login to continue');
    else{
        try{
            let res = await axios.get(`${backend_url}/user/get-user`, {headers: {"Authorization": token}});
            if(res.status !== 200)
                throw new Error(res.data.error);
            user = res.data.user;
            await getMessages();
            scrollSmoothlyToBottom('chat-box');

        }
        catch(err){
            showError(err.message);
        }
    }
}

function createNewChat(message){
    let chatBox = document.querySelector('#chat-box');
    let div1 = document.createElement('div');
    if(message.UserId === user.id)
        div1.className = 'd-flex align-items-baseline text-end justify-content-end mb-4';
    else
        div1.className = 'd-flex align-items-baseline mb-4';

    let div2 = document.createElement('div');
    div2.className = 'pe-2';
    let div3 = document.createElement('div');

    div3.className = 'profile';
    let text = document.createTextNode(`${message.user}`);
    div3.appendChild(text);

    let div4 = document.createElement('div');
    div4.className = 'card card-text d-inline-block p-2 px-3 m-1 graident-color-right-to-left';
    div4.appendChild(document.createTextNode(`${message.message}`));

    let div5 = document.createElement('div');
    div5.className = 'small'
    div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('hh:mm a')}`));

    div2.appendChild(div3);
    div2.appendChild(div4);
    div2.appendChild(div5);
    div1.appendChild(div2);
    chatBox.appendChild(div1);
}

function showMessages(messages){
    console.log(moment(messages[0].createdAt).format("hh:mm a"))

    for(let i=0;i<messages.length;i++){
        createNewChat(messages[i]);
    }
}

async function getMessages(){
    try{
        let res = await axios.get(`${backend_url}/chat/get-messages`, {headers: {"Authorization": token}});
        messages = res.data.messages.length;
        console.log(messages)
        showMessages(res.data.messages);
        if(res.status!==200)
            throw new Error(res.data.error);
    }
    catch(err){
        showError(err.message);
    }
}

async function sendMessage(e){
    e.preventDefault();
    let message = e.target.msg.value;
    if(message==='' || message===null)
        throw new Error('Empty Message');
    try{
        e.target.reset();
        let res = await axios.post(`${backend_url}/chat/send-message`, {message}, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        messages += 1;
        createNewChat(res.data.message);  
        scrollSmoothlyToBottom('chat-box');

    }
    catch(err){
        showError(err.message)
    }
}