const backend_url = 'http://localhost:3000'
const form = document.querySelector('#signup-form');

form.addEventListener('submit', signUpUser);

function containsOnlySpaces(str) {
    return str.trim().length === 0;
}

function showError(err){
    let err_div = document.querySelector('#error');
    err_div.className = 'alert alert-danger';
    err_div.innerHTML = err;  
    $( "#error" ).fadeIn( 300 ).delay( 3000 ).fadeOut( 400 );
}

async function signUpUser(e){
    e.preventDefault();
    let signUpObj = {
        name: e.target.name.value.trim(),
        email: e.target.email.value.trim(),
        phone: e.target.phone.value.trim(),
        password: e.target.password.value.trim(),
    }

    e.target.reset();

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
}