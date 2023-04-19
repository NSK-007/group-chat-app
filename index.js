const backend_url = 'http://localhost:3000'
const form = document.querySelector('#signup-form');
const login_form = document.querySelector('#login-form');

document.addEventListener('DOMContentLoaded', checkAuthentication);
let token;

if(form!==null)
    form.addEventListener('submit', signUpUser);
if(login_form!==null)
    login_form.addEventListener('submit', loginUser);

function containsOnlySpaces(str) {
    return str.trim().length === 0;
}

function showError(err){
    let err_div = document.querySelector('#error');
    err_div.className = 'alert alert-danger';
    err_div.innerHTML = err;  
    $( "#error" ).fadeIn( 400 ).delay( 3000 ).fadeOut( 400 );
}

function showSuccess(err){
    let err_div = document.querySelector('#error');
    err_div.className = 'alert alert-success';
    err_div.innerHTML = err;

    $( "#error" ).fadeIn( 400 ).delay( 3000 ).fadeOut( 400 );
}

async function signUpUser(e){
    e.preventDefault();
    let signUpObj = {
        name: e.target.name.value.trim(),
        email: e.target.email.value.trim(),
        phone: e.target.phone.value.trim(),
        password: e.target.password.value.trim(),
    }

    if (containsOnlySpaces(signUpObj.email) || containsOnlySpaces(signUpObj.name) || signUpObj.name == null || signUpObj.name == '' || signUpObj.email == null || signUpObj.email == '' || signUpObj.password == null || signUpObj.password == '') {
       showError('Please enter the fields properly');
       return;
    }

    try{
        let res = await axios.post(`${backend_url}/user/signup`, signUpObj);
        // console.log(res);
        if(res.status !== 200)
            throw new Error(res.data.error);
    }
    catch(err){
        showError(err.message);
    }
    e.target.reset();

}

async function loginUser(e){
    e.preventDefault();
    let login_obj = {
        email: e.target.email.value,
        password: e.target.password.value
    }

    e.target.reset();
    try{
        let res = await axios.post(`${backend_url}/user/login`, login_obj);
        if(res.status!==200)
            throw new Error(res.data.error);
        showSuccess(res.data.message);
        localStorage.setItem('token', res.data.token);
    }
    catch(err){
        showError(err.message);
    }
}

function checkAuthentication(){
    token = localStorage.getItem('token');
    console.log(token);
    if(token !== null)
        window.location.href = './chat.html';
}