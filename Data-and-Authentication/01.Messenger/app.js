function attachEvents() {
    const sendBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');

    sendBtn.addEventListener('click', sendMsg);
    refreshBtn.addEventListener('click', getMessages);
}

async function sendMsg(e) {
    let author = document.getElementById('author').value;
    let content = document.getElementById('content').value;

    if (author == '' || content == '') {
        alert('The fields are recuired!');
        return;
    }
    try {
        const response = await fetch('http://localhost:3030/jsonstore/messenger', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content })
        });
        if (response.ok == false) {
            alert('The request is not correct!');
            return;
        }
        document.getElementById('author').value = '';
        document.getElementById('content').value = '';

        getMessages();
    } catch (error) {
        alert(error.message);
    }
}

async function getMessages(e) {
    const textArea = document.getElementById('messages');

    try {
        const response = await fetch('http://localhost:3030/jsonstore/messenger');
        if (response.ok == false) {
            alert('The request is not correct!');
            return;
        }
        const data = await response.json();
        let messages = [];
        Array.from(Object.values(data)).forEach(e => {
            messages.push(`${e.author}: ${e.content}`);
        });
        textArea.textContent = messages.join('\n');
    } catch (error) {
        alert(error.message);
    }
}

attachEvents();