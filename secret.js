'use strict';


async function getCount() {
    
    /*
    const res = await fetch('/secret/count', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
    });
    console.log(res.count)
*/
    fetch('/secret/count')
            .then(response => response.json())
            .then(data => {
                console.log(data.count)
                document.getElementById('paragraph').innerHTML = "Count: " + data.count
            });
    

}

window.addEventListener('load', getCount);