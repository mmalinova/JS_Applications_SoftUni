function attachEvents() {
    const postsURL = 'http://localhost:3030/jsonstore/blog/posts';
    const commentsURL = 'http://localhost:3030/jsonstore/blog/comments';

    const loadPostsBtn = document.getElementById('btnLoadPosts');
    const viewPostsBtn = document.getElementById('btnViewPost');
    const select = document.getElementById('posts');

    loadPostsBtn.addEventListener('click', loadPosts);
    viewPostsBtn.addEventListener('click', displayPost);

    async function loadPosts(e) {
        try {
            const response = await fetch(postsURL);
            if (response.ok == false) {
                throw new Error('Error');
            }
            const data = await response.json();

            select.innerHTML = '';
            Object.entries(data).forEach(([key, value]) => {
                const option = createEl('option', `${value.title}`, [`value = ${key}`]);
                select.appendChild(option);
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    function displayPost() {
        const postID = select.value;
        viewComments(postID);
    }

    async function viewComments(postID) {
        const ul = document.getElementById('post-comments');
        ul.innerHTML = '';

        const url = `http://localhost:3030/jsonstore/blog/posts/${postID}`;
        try {
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(url),
                fetch(commentsURL)
            ]);

            if (postResponse.ok == false) {
                throw new Error('Error');
            }
            const postData = await postResponse.json();

            document.getElementById('post-title').textContent = postData.title;
            document.getElementById('post-body').textContent = postData.body;

            if (commentsResponse.ok == false) {
                throw new Error('Error');
            }
            const commentsData = await commentsResponse.json();

            Object.values(commentsData).filter(comment => comment.postId === postID).forEach(comm => {
                const li = createEl('li', comm.text, [`id = ${comm.id}`]);
                ul.appendChild(li);
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    function createEl(type, text, attributes = []) {
        let element = document.createElement(type);
        if (text) {
            element.textContent = text;
        }
        if (attributes) {
            for (const attribute of attributes) {
                let [name, value] = attribute.split(' = ');
                element.setAttribute(name, value);
            }
        }
        return element;
    }
}

attachEvents();