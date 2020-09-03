let activate = document.getElementById('activate');
let rightReadLoginSubmit = document.getElementById('rightReadLoginSubmit');
let loginContainer = document.getElementById('login');
let loggedInContainer = document.getElementById('loggedIn');

chrome.storage.sync.get('token', function(result)  {
    let authorized = result.token;
    if (authorized) {
        chrome.storage.sync.get('name', function(result)  {
            loggedInContainer.innerText = result.name;
        });
        loggedInContainer.style.display = 'block';
    } else {
        loginContainer.style.display = 'block';
    }
});

activate.onclick = function (element) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'contentScript.js'});
    });
};

rightReadLoginSubmit.onclick = function()
{
    var email = document.getElementById('rightReadLogin').value;
    var data = new FormData();
    data.append('email',  email)
    data.append('password',  document.getElementById('rightReadPassword').value)
    var x = new XMLHttpRequest();
    x.open('POST', 'https://rightread.ca/api/auth/login');
    x.onload = function() {
        var authorization = x.getResponseHeader('authorization')
        if(authorization) {
            chrome.storage.sync.set({'token': authorization})
            chrome.storage.sync.set({'name': email})
            loginContainer.style.display = 'none';
            loggedInContainer.innerText = email;
            loggedInContainer.style.display = 'block';
        } else {
            alert('Wrong name/password');
        }
    };
    x.send(data);
}