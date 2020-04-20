`use strict`;
const inputs =document.querySelectorAll('input');


function buttonpass(){
    var myPassWors =document.getElementById(pass2);
    if ( pass2.type === "password"){
        pass2.type ="text";
    }else{
       pass2.type ="password";
        
    }
}

const patterns ={
    username:/^[a-z\d]{4,12}$/i ,
    password:/^[\w@-]{8,20}$/,
    email:/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/
};

function validate(field,regex){
    if(regex.test(field.value)){
        field.className='valid';
    }else{
        field.className='invalid';

    }
}


inputs.forEach((input) => {
    input.addEventListener('keyup',(e)=>{
        validate(e.target,patterns[e.target.attributes.name.value])
    });
    
});