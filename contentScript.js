var findWord = function (elem) {
    elem.innerHTML = elem.innerHTML.replace(/\b(\S+)\b/g, '<span class="rightread">$1</span>')

    let spans = elem.querySelectorAll('.rightread');

    spans.forEach(function (span) {
        span.onclick = function () {
            let text = this.innerText;
            let token = null;
            chrome.storage.sync.get('token', function(result)  {
                token = result.token;
                var x = new XMLHttpRequest();
                x.open('GET', 'https://rightread.ca/api/word/add/' + encodeURI(text));
                x.setRequestHeader('Authorization', 'Bearer ' + token);
                x.onload = function () {
                    var authorization = x.getResponseHeader('authorization')
                    if (authorization) {
                        chrome.storage.sync.set({token: authorization})
                    }
                    console.log(x.getAllResponseHeaders())
                    console.log(x.getResponseHeader('status'))
                    if (x.getResponseHeader('status') == 401) {
                        chrome.storage.sync.remove(['token', 'name']);
                    }
                };
                x.send();
            });
        }
    })
}

let selectors = document.querySelectorAll('p');
let node = document.createElement("div");
node.setAttribute('id', 'rightread-container');
node.style.display = 'none';
document.body.appendChild(node);

selectors.forEach(function (element) {
    element.classList.add('rightread-p')

    element.onclick = function (e) {
        if (!e.target.classList.contains('rightread')) {
            e.preventDefault();
            e.stopPropagation();

            node.innerText = element.innerText;
            node.style.display = 'block';

            findWord(document.getElementById('rightread-container'));
        }
    }
});

