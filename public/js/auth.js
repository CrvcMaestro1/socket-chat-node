const form = document.querySelector('form')


const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://rest-server-node-crvc.herokuapp.com/api/auth/'

form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = {}
    for (let element of form.elements) {
        if (element.name.length > 0) {
            formData[element.name] = element.value
        }
    }
    fetch(`${url}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.log(msg)
            }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(console.warn);
})

function handleCredentialResponse(response) {
    const body = { id_token: response.credential };
    fetch(`${url}google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(({ token, usuario }) => {
            localStorage.setItem('token', token)
            localStorage.setItem('email', usuario.correo)
            window.location = 'chat.html'
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    google.accounts.id.disableAutoSelect();
    if (localStorage.getItem('email') !== null) {
        google.accounts.id.revoke(localStorage.getItem('email'), done => {
            localStorage.clear()
            location.reload()
        });
    }
}