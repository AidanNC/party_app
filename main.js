'use strict';


async function sendResponse() {

    const message = {};
    message['value'] = document.getElementById('attending').checked;
    
    document.cookie = "clicked="+message["value"];
    console.log(document.cookie)
    const res = await fetch('/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(message),
    });
    

    //window.location.href = res.url;

}

async function setValue(){
    const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('clicked='))
  console.log(cookieValue);
  console.log(document.cookie);
  if(cookieValue!=undefined){
    document.getElementById('attending').checked = cookieValue.split('=')[1] == "true"
  }
}

window.addEventListener('load',setValue);
window.addEventListener('load', () => {
    document.getElementById('attending').addEventListener('click', sendResponse);
});
