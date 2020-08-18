const currentPosts = [];
let currentUserId;
let currentUserName = 'Bob';


document.addEventListener("DOMContentLoaded", function(e) {
    const URL = "http://localhost:3000/posts/"
    const LIKE_URL = "http://localhost:3000/likes/"
    const COMMENTS_URL = "http://localhost:3000/comments/"

    function getPosts() {
        const postContainer = document.querySelector(".post-container")
        
        fetch(URL)
        .then(res => res.json())
        .then(posts => {
            posts.forEach(post => {
            currentPosts.push(post)
            })
        let sortedPosts = currentPosts.sort((a, b) => parseInt(a.date.split("-").join("")) - parseInt(b.date.split("-").join("")))
       
        sortedPosts.forEach(post => renderPost(post, postContainer))
        })
    }

    function renderPost(post, postContainer) {
        currentUserId = post.user_id
        const postCard = document.createElement("div") 
        postCard.classList.add("card")
        postCard.dataset.id = post.id

        postCard.innerHTML = `
        <h5 class="card-header">${post.title}</h5>
            <div class="card-body">
              <h5 class="card-title" id='username'>Bob</h5>
              <h6 class="card-title likes" id='username'>Likes: <span>${post.likes.length}</span></h6>
              <h6 class="card-title" id='date'><em>${post.date}</em></h6>
              <p class="card-text">${post.content}</p>
              <div class="buttons">
                <a href="#" class="btn btn-secondary">Comments</i></a>
                <a href="#" class="btn btn-primary"><i class="fa fa-hear fa-heart"></i></a>
              </div>
              <ul id="comments">
              </ul>
            </div>
        `

        let commentUl = postCard.querySelector('ul')

        for (const comment of post.comments) {
            let commentCont = document.createElement('li'),
                commentHr = document.createElement('hr'),
                commentName = document.createElement('p');

                commentCont.textContent = comment.content
                commentName.innerHTML = `<em> - ${comment.name}</em>`

                commentUl.appendChild(commentCont)
                commentUl.appendChild(commentName)
                commentUl.appendChild(commentHr)
                
                

        }   

        let addCommentBtn = document.createElement('a')
            addCommentBtn.className = 'btn btn-dark'
            addCommentBtn.textContent= 'Add Comment'

            commentUl.appendChild(addCommentBtn)
            commentUl.style.display='none'
            postContainer.append(postCard)
    }

    let commentButtonHandler = () => {
        document.addEventListener('click', function(e) {
            e.preventDefault()
            
            if (e.target.matches(".btn.btn-secondary")) {
                let commentUl = e.target.parentElement.parentElement.querySelector('ul')
                    if (commentUl.style.display === 'block') {
                        commentUl.style.display = 'none'
                    } else {
                        commentUl.style.display = 'block'
                    }
                  
            } else if (e.target.matches('.btn.btn-dark')) {
                    if (e.target.textContent === 'Add Comment') {
                        let ul = e.target.parentElement
        
                        renderForm(ul)

                        e.target.textContent = 'Cancel'
                    } else if (e.target.textContent === 'Cancel') {
                        e.target.textContent = 'Add Comment'
                        let form = e.target.parentElement.querySelector('form')

                            form.remove()
                    }

                    }

              }


        )
    }


    function renderForm(ul) {
        let editForm = document.createElement("form")

        editForm.innerHTML = `
        <label for="content">Content:</label><br>
        <textarea type="text" id="content" name="content"></textarea>
        <br>
        <input type="submit" value="Submit">
        `

        ul.append(editForm)

    }

    let likeHandler = () => {
        document.addEventListener('click', function(e) {
            // e.preventDefault()
            if (e.target.className === 'btn btn-primary' || e.target.className === "fa fa-hear fa-heart") {
                const postBox = e.target.closest("div").parentElement.parentElement
                
                postLike(postBox)
            }
        })

    }

    function postLike(postBox) {
        const postId = postBox.dataset.id
        
       let likes = postBox.querySelector('.card-title.likes > span')
       likes.innerText = `${parseInt(likes.innerText) +1}`

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                user_id: parseInt(currentUserId),
                post_id: parseInt(postId)
            })
        }

        fetch(LIKE_URL, options)
        // .then(res => 
        //     getPosts())
    }


    function submitHandler() {
        document.addEventListener('click', function(e) {
           
            if (e.target.value === "Submit") {
                e.preventDefault()
                let newComment = e.target.parentElement.querySelector('textarea') //.value for value
                console.log(newComment)

                postComment(newComment)
            }

        })

    }

    function postComment(newComment) {
        let postId = newComment.parentElement.parentElement.parentElement.parentElement.dataset.id
            

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                user_id: parseInt(currentUserId),
                post_id: parseInt(postId),
                content: newComment.value,
                name: "Bob"
            })
        }

        fetch(COMMENTS_URL, options)
            .then(res => {
                let commentCont = document.createElement('li'),
                    commentHr = document.createElement('hr'),
                    commentName = document.createElement('p'),
                    ul = newComment.parentElement.parentElement,
                    lastLi = ul.querySelector('.btn.btn-dark')

                    commentCont.textContent = newComment.value
                    commentName.innerHTML = `<em> - ${currentUserName}</em>`

                    ul.insertBefore(commentCont, lastLi)
                    ul.insertBefore(commentName, lastLi)
                    ul.insertBefore(commentHr, lastLi)

            })
    }

    const profileHandler = () => {
        document.addEventListener('click', function(e) {
            if (e.target.textContent === "Profile") {}
            
        })
    }

  
    commentButtonHandler()
    profileHandler()
    likeHandler()
    submitHandler()
    getPosts()




    
})

