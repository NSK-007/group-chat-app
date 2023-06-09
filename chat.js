const backend_url = 'http://localhost:3000';
let socket;
document.addEventListener('DOMContentLoaded', checkAuthentication);
document.addEventListener('DOMContentLoaded', getGroups);
document.addEventListener('DOMContentLoaded', socketConnection);
let token = localStorage.getItem('token');
const chatForm = document.querySelector('#chat-form');
let back = document.querySelector('#back');
let create_group = document.querySelector('#create-group');
let groups = document.querySelector('#groups');
let logout = document.querySelector('#log-out');
let group_form = document.querySelector('#group-form');
let groups_list = document.querySelector('#groups_list');
let invite_form = document.querySelector('#invite-form');
let members = document.querySelector('#members');
let back_to_chat = document.querySelector('#back-to-chat');
let group_id;
let group_admin;

chatForm.addEventListener('submit', sendMessage);
back.addEventListener('click', closeChatWindow);
create_group.addEventListener('click', createGroup);
groups.addEventListener('click', goToGroups);
logout.addEventListener('click', logoutUser);
group_form.addEventListener('submit', createNewGroupInBackend);
groups_list.addEventListener('click', openChatWindow);
invite_form.addEventListener('submit', addNewMember);
members.addEventListener('click', showMembers);
back_to_chat.addEventListener('click', backToChatBox);

let user;
let messages = 0;




function containsOnlySpaces(str) {
    return str.trim().length === 0;
}

const scrollSmoothlyToBottom = (id) => {
    // console.log('scrolling....')
    const element = $(`#${id}`);
    element.animate({
        scrollTop: element.prop("scrollHeight")
    }, 1500);
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

    getGroups();
}

async function openChatWindow(e){
    $('#chat-modal').delay(500).fadeOut('slow');
    $('#chat-modal-box').delay(500).fadeIn('slow');

    let title = document.querySelector('#chat-box-title');
    title.innerHTML = e.target.innerHTML;
    group_id = (e.target.id).split('group_')[1];

    try{
        let res = await axios.get(`${backend_url}/user/is-admin/${group_id}`, {headers:{"Authorization": token}});
        console.log('admin', res.data.admin);
        if(res.status!==200)
            throw new Error(res.data.error);
        group_admin = res.data.admin;
    }
    catch(err){
        group_admin = false;
        console.log(err);
        showError(err.message, '#chat-box-error')
    }

    await getMessages(group_id);
    setTimeout(() => {
        $('#chat-modal').modal('hide');
        scrollSmoothlyToBottom('chat-box');
        $('#chat-modal-box').style.display = 'block';
    }, 1000);   
}

async function showMembers(){
    $('#chat-modal-box').delay(500).fadeOut('slow');
    $('#members-modal').delay(500).fadeIn('slow');

    await getGroupMembers(group_id);

    setTimeout(() => {
        $('#chat-modal-box').modal('hide');
        $('#members-modal').style.display = 'block';
    }, 1000);


}

function backToChatBox(){
    $('#members-modal').delay(500).fadeOut('slow');
    $('#chat-modal-box').delay(500).fadeIn('slow');

    setTimeout(() => {
        $('#members-modal').modal('hide');
        scrollSmoothlyToBottom('chat-modal-box');
        $('#chat-modal-box').style.display = 'block';
    }, 1000)
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
        showError(err.message,'#create-group-error')
    }
}

function addGroups(groups){
    groups_list.innerHTML = '';
    for(let i=0;i<groups.length;i++){
        let button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action';
        button.id = 'group_'+groups[i].GroupId;
        button.appendChild(document.createTextNode(`${groups[i].name}`));
        button.style.color = 'chocolate';
        button.style.borderRadius = '2px'
        button.style.borderColor = 'brown'
        groups_list.appendChild(button);
    }
}

function showGroupMembers(groupmembers){
    let group_members = document.querySelector('#group-members-box');
    group_members.innerHTML = '';

    for(let i=0;i<groupmembers.length;i++){
        let li = document.createElement('li');
        li.className = 'list-group-item';

        let btn = document.createElement('button');
        btn.className = 'btn graident-color-right-to-left'
        btn.appendChild(document.createTextNode('make admin'));
        btn.id = `admin_${groupmembers[i].id}`;
        btn.addEventListener('click', makeAdmin);

        let btn2 = document.createElement('button');
        btn2.className = 'btn graident-color-right-to-left'
        btn2.appendChild(document.createTextNode('remove'));
        btn2.id = `remove_${groupmembers[i].id}`;

        btn2.addEventListener('click', removeMember);

        let div = document.createElement('div');
        if(user.id !== groupmembers[i].id){
            div.className = 'float-end';
            div.appendChild(btn);
            div.append(' ');
            div.appendChild(btn2);
        }

        li.appendChild(document.createTextNode(`${groupmembers[i].name}`));
        li.style.color = 'chocolate';

        if(groupmembers[i].admin === 1){
            let span = document.createElement('span');
            span.className = 'badge badge-secondary'
            span.appendChild(document.createTextNode('admin'));
            span.style.color = 'brown';
            li.appendChild(span);
        }
        
        if(group_admin)
            li.appendChild(div);
        group_members.appendChild(li);

    }
}

async function makeAdmin(e){
    try{
        let user_id = (e.target.id).split('admin_')[1];
        console.log(user_id);
        let res = await axios.put(`${backend_url}/group/make-admin/${group_id}/${user_id}`,{}, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        await getGroupMembers(group_id);
    }
    catch(err){
        console.log(err);
        showError(err.message, '#group-member-error');
    }
}

async function removeMember(e){
    try{
        let user_id = (e.target.id).split('remove_')[1];
        console.log(user_id);
        let res = await axios.delete(`${backend_url}/group/remove-member/${group_id}/${user_id}`, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        await getGroupMembers(group_id);
    }
    catch(err){
        console.log(err);
        showError(err.message, '#group-member-error');
    }
}

async function getGroupMembers(group_id){
    try{
        let res = await axios.get(`${backend_url}/group/get-group-members/${group_id}`, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        showGroupMembers(res.data.members);
    }
    catch(err){
        console.log(err);
        showError(err.message, '#group-member-error');
    }
}

async function addNewMember(e){
    try{
        let phone = e.target.invite.value;
        if(phone==='' || phone===null)
            throw new Error('Enter correct phone number');

        let res = await axios.post(`${backend_url}/group/add-new-member/${group_id}`, {phone}, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        console.log(res.data); 
    }
    catch(err){
        console.log(err);
        showError(err.message, '#chat-box-error');
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
        showError(err.message, '#group-list-error')
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


async function checkNewMessagesInCurrentGroup(group_id){
    try{
        let res = await axios.get(`${backend_url}/chat/new-messages/${messages}/${group_id}`, {headers: {"Authorization": token}});
        return res.data.new_messages;
    }
    catch(err){
        showError(err.message, '#chat-box-error');
    }
}

//-------do not remove this--------------//
// setInterval(async () => {

//     let new_messages = await checkNewMessagesInCurrentGroup(group_id);
//     console.log(new_messages);
//     if(new_messages!==undefined || new_messages.length>0){
//         messages = messages + new_messages.length;
//         for(let i=0;i<new_messages.length;i++){
//             createNewChat(new_messages[i]);
//             scrollSmoothlyToBottom('chat-box');
//         }
//     }
// }, 3000);

async function showError(err, id){
    let err_div = document.querySelector(id);
    err_div.className = 'alert alert-danger';
    err_div.innerHTML = err;  
    $(id).fadeIn( 400 ).delay( 3000 ).fadeOut( 400 );

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
    console.log('authenticating...')
    if(token === null)
        showError('Please login to continue', '#group-list-error');
    else{
        try{
            let res = await axios.get(`${backend_url}/user/get-user`, {headers: {"Authorization": token}});
            if(res.status !== 200)
                throw new Error(res.data.error);
            user = res.data.user;
            // await getMessages();
            // scrollSmoothlyToBottom('chat-box');
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

    if(message.fileURL!==''){
        if(message.type === 'mp3'){
            let audio = document.createElement('audio');
            audio.setAttribute('width', '250px');
            audio.setAttribute('height', '250px');
            audio.controls = true;

            let source = document.createElement('source');
            source.setAttribute('src', message.fileURL);
            source.setAttribute('type', 'audio/mp3');
            audio.appendChild(source);
            div4.appendChild(audio);
        }
        else if(message.type === 'pdf'){
            let object = document.createElement('object');
            object.setAttribute('type', 'application/pdf');
            object.setAttribute('width', '250px');
            object.setAttribute('height', '250px');
            object.setAttribute('data', message.fileURL);
            div4.appendChild(object);
        }
        else if(message.type === 'jpg' || message.type === 'jpeg' || message.type === 'png' ){
            let img = document.createElement('img');
            img.className = 'rounded mx-auto d-block';
            img.setAttribute('src', message.fileURL);
            img.setAttribute('width', '250px');
            img.setAttribute('height', '250px');
            div4.appendChild(img);
        }
        else if(message.type === 'mp4'){
            let video = document.createElement('video');
            video.setAttribute('width', '250px');
            video.setAttribute('height', '250px');
            video.controls = true;
        
            let source = document.createElement('source');
            source.setAttribute('src', message.fileURL);
            source.setAttribute('type', 'video/mp4');
        
            video.appendChild(source);
            div4.appendChild(video);
        }
        let br = document.createElement('br');
        div4.appendChild(br);
    }


    div4.appendChild(document.createTextNode(`${message.message}`));    
    let div5 = document.createElement('div');
    div5.className = 'small';

    if(message.created_date === undefined || message.created_date === ''){
        if(moment(message.createdAt).format('DD-MM-YYY') === moment(new Date()).format('DD-MM-YYY'))
            div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('hh:mm a')}`));
        else if(moment(message.createdAt).format('YYY') === moment(new Date()).format('YYY'))
            div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('DD-MM hh:mm a')}`));
        else
            div5.appendChild(document.createTextNode(`${moment(message.createdAt).format('DD-MM hh:mm a')}`));
    }
    else{
        console.log('archived')
        if(moment(message.created_date).format('DD-MM-YYY') === moment(new Date()).format('DD-MM-YYY'))
            div5.appendChild(document.createTextNode(`${moment(message.created_date).format('hh:mm a')}`));
        else if(moment(message.created_date).format('YYY') === moment(new Date()).format('YYY'))
            div5.appendChild(document.createTextNode(`${moment(message.created_date).format('DD-MM hh:mm a')}`));
        else
            div5.appendChild(document.createTextNode(`${moment(message.created_date).format('DD-MM hh:mm a')}`));
    }

    div2.appendChild(div3);
    div2.appendChild(div4);
    div2.appendChild(div5);
    div1.appendChild(div2);
    chatBox.appendChild(div1);
}

function showMessages(messages){
    // console.log(moment(messages[0].createdAt).format("hh:mm a"))
    document.querySelector('#chat-box').innerHTML = '';
    // console.log('chat box...')
    for(let i=0;i<messages.length;i++){
        createNewChat(messages[i]);
    }
    // scrollSmoothlyToBottom('chat-box');
}

async function getMessages(group_id){
    // console.log('getting msgs....')
    messages = 0;
    try{
        // console.log(group_id);
        let res = await axios.get(`${backend_url}/chat/get-messages/${group_id}`, {headers: {"Authorization": token}});
        if(res.status!==200)
            throw new Error(res.data.error);
        messages = res.data.messages.length;
        // console.log(res.data.messages);
        // if(res.data.messages.length>0)
            showMessages(res.data.messages);
    }
    catch(err){
        showError(err.message, '#chat-box-error');
    }
}

async function sendMessage(e){
    try{
    e.preventDefault();
    let file = e.target.multimedia.files[0];
    let message = e.target.msg.value;
   
    if(message === '' && file === undefined)
        throw new Error('Empty Message')

    if(file!==undefined){
        if(!(file.type).includes('mp4') || !(file.type).includes('mp3') || !(file.type).includes('mpeg') || !(file.type).includes('pdf') || !(file.type).includes('jpg') || !(file.type).includes('jpeg') || !(file.type).includes('png')){
        throw new Error('Please upload only mp4, mp3, mpeg, jpg/jpeg/png, pdf files only');
       }
    }

    var formData = new FormData();
    formData.append('message', message);
    formData.append('multimedia', e.target.multimedia.files[0]);
   
    
        e.target.reset();
        console.log(file);
        
        let res = await fetch(`${backend_url}/chat/send-message/${group_id}`, {
            method: 'POST',
            headers: {
              "Authorization": token,
            },
            body: formData,
        })
        if(res.status!==200)
            throw new Error(res.data.error);

        res = await (res.json());
        messages += 1;
        createNewChat(res.message);  
        scrollSmoothlyToBottom('chat-box');
    }
    catch(err){
        console.log(err)
        showError(err.message, '#chat-box-error')
    }
}

function socketConnection(){
    try{
        socket = io(backend_url);
        socket.on('connect', () => {
            console.log(socket.id);
            
            socket.on('new-message', (msg) => {
                // console.log(msg, user, group_id);
                if(msg.UserId !== user.id && msg.GroupId === +group_id){
                    createNewChat(msg);
                    scrollSmoothlyToBottom('chat-box');
                }
            })
        })
    }
    catch(err){
        console.log(err)
        showError(err.message, '#chat-box-error');
    }
}