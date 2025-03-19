let username = 'a'
let password = 'a'
let passwordinput = 'a'
function login(){
    username = document.getElementById('usernameinput').value
    if (username == "PixelMan"){
        password = 'alexsmall2013'
    }
    else if (username == "Smiley7694"){
        password = 'Sanloga123'
        

    }
    else if (username == "Zac123"){
        password = 'zaciscool'
        

    }
    else if (username == "Lillysmall"){
        password = 'Alex1Samuel2Emily3'

        
    }
    else if (username == "sPixelKid"){
        password = 'sammysammy'
        

    }
        else if (username == "twinkletwinkle"){
        password = 'littlestar'
        

    }
    else{
        console.log('waiting')
    }
}
function test(){
    console.log(username)
    console.log(password)
}
function submit(){
    passwordinput = document.getElementById('passwordinput').value
    if (username == "PixelMan" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else if (username == "Smiley7694" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else if (username == "Zac123" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else if (username == "sPixelKid" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else if (username == "Lillysmall" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else if (username == "twinkletwinkle" && passwordinput == password){
        window.location.href = 'PixelMan_website.html'
    }
    else{
        let msg = document.getElementById("Messsage_incorrect")
        msg.innerText = "Your username or password is incorrect"
    
    }
}
function code(){
    window.location.href = 'code.html'
}
