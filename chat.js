document.addEventListener('DOMContentLoaded', checkAuthentication);
document.addEventListener('DOMContentLoaded', getGroups);
let token = localStorage.getItem('token');
const chatForm = document.querySelector('#chat-form');
let back = document.querySelector('#back');
let create_group = document.querySelector('#create-group');
let groups = document.querySelector('#groups');
let logout = document.querySelector('#log-out');
let group_form = document.querySelector('#group-form');

chatForm.addEventListener('submit', sendMessage);
back.addEventListener('click', closeChatWindow);
create_group.addEventListener('click', createGroup);
groups.addEventListener('click', goToGroups);
logout.addEventListener('click', logoutUser);
group_form.addEventListener('submit', createNewGroupInBackend);


let user;
const backend_url = 'http://localhost:3000';
let messages = 0;

function containsOnlySpaces(str) {
    return str.trim().length === 0;
}

const scrollSmoothlyToBottom = (id) => {
    const element = $(`#${id}`);
    element.animate({
        scrollTop: element.prop("scrollHeight")
    }, 2500);
}

function logoutUser(){
    console.log('logging out...')
    token = null;
    localStorage.removeItem('token');
    checkAuthentication();
}

function goToGroups(){
    $('#group-modal').delay(500).fadeOut('slow');
    $('#chat-modal').delay(500).fadeIn('slow');
    setTimeout(function(){
        $('#group-modal').modal('hide');
        $('#chat-modal').style.display = 'block';
    }, 1000);
}

function createGroup(){
    $('#chat-modal').delay(500).fadeOut('slow');
    $("#group-modal").delay(500).fadeIn('slow');
    setTimeout(function() {
        $("#chat-modal").modal('hide');
        $('#group-modal').style.display = 'block';
    }, 1000);
}

async function createNewGroupInBackend(e){
    e.preventDefault();

    let groupObj = {
        name: e.target.name.value
    }

    if (containsOnlySpaces(groupObj.name) || groupObj.name===null) {
        console.log('Please enter the fields properly');
        return;
     }

    try{
        let res = await axios.post(`${backend_url}/group/create-group`, groupObj, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(err);
        console.log(res.data);
        goToGroups();
    }
    catch(err){
        console.log(err);
    }
}

function addGroups(groups){
    let groups_list = document.querySelector('#groups_list');
    for(let i=0;i<groups.length;i++){
        let button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.id = 'group_'+groups[i].id;
        button.appendChild(document.createTextNode(`${groups[i].name}`));

        groups_list.appendChild(button);
    }
}

async function getGroups(){
    try{
        let res = await axios.get(`${backend_url}/group/get-groups`, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(err);
        addGroups(res.data.groups);
    }
    catch(err){
        console.log(err);
    }
}

function closeChatWindow(){
   
    $('#chat-modal-box').delay(500).fadeOut('slow');
    $('#chat-modal').delay(500).fadeIn('slow');
    setTimeout(function() {
        $("#chat-modal-box").modal('hide');
        $("#chat-modal").style.display = 'block';
    }, 1000);
  
}


async function checkNewMessages(){
    try{
        let res = await axios.get(`${backend_url}/chat/new-messages/${messages}`, {headers: {"Authorization": token}});
        return res.data.new_messages;
    }
    catch(err){
        showError(err.message);
    }
}
// setInterval(async () => {

//     let new_messages = await checkNewMessages();
//     if(new_messages!==undefined){
//         messages = messages + new_messages.length;
//         for(let i=0;i<new_messages.length;i++){
//             createNewChat(new_messages[i]);
//             scrollSmoothlyToBottom('chat-box');
//         }
//     }
// }, 3000);

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

async function checkAuthentication(){
    // console.log('authenticating...')
    if(token === null)
        showError('Please login to continue');
    else{
        try{
            let res = await axios.get(`${backend_url}/user/get-user`, {headers: {"Authorization": token}});
            if(res.status !== 200)
                throw new Error(res.data.error);
            user = res.data.user;
            console.log(user);
            await getMessages();
            scrollSmoothlyToBottom('chat-box');
        }
        catch(err){
            window.location.href = './login.html'
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
    
    if(moment(message.createdAt).format('DD-MM-YYY') === moment(new Date()).format('DD-MM-YYY'))
        div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('hh:mm a')}`));
    else if(moment(message.createdAt).format('YYY') === moment(new Date()).format('YYY'))
        div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('DD-MM hh:mm a')}`));
    else
        div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('DD-MM hh:mm a')}`));

    div2.appendChild(div3);
    div2.appendChild(div4);
    div2.appendChild(div5);
    div1.appendChild(div2);
    chatBox.appendChild(div1);
}

function showMessages(messages){
    // console.log(moment(messages[0].createdAt).format("hh:mm a"))

    for(let i=0;i<messages.length;i++){
        createNewChat(messages[i]);
    }
}

async function getMessages(){
    try{
        let res = await axios.get(`${backend_url}/chat/get-messages`, {headers: {"Authorization": token}});
        messages = res.data.messages.length;
        // console.log(messages)
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