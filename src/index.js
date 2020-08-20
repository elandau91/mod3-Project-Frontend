let currentPosts = [];
let sortedPosts = [];
let currentUserId;
let currentUserName;



document.addEventListener("DOMContentLoaded", function(e) {
    const URL = "http://localhost:3000/posts/"
    const LIKE_URL = "http://localhost:3000/likes/"
    const COMMENTS_URL = "http://localhost:3000/comments/"
    const USER_URL = "http://localhost:3000/users/"

    function getPosts() {
        const postContainer = document.querySelector(".post-container")
            postContainer.innerHTML = ''
            currentPosts = []
            fetch(URL)
            .then(res => res.json())
            .then(posts => {
                posts.forEach(post => {
                currentPosts.push(post)
                })
                sortedPosts = currentPosts.sort((a, b) => parseInt(b.date.split("-").join("")) - parseInt(a.date.split("-").join("")))
        
                sortedPosts.forEach(post => renderPost(post, postContainer))
            })
    }

    function renderPost(post, postContainer) {
              currentUserId = post.user_id
            
            //apply user fetch here and .then everything in function below for dynamic user?
        fetch(USER_URL + currentUserId)
        .then(res => res.json())
        .then(user => {
            currentUserName = user.name
            
            let avatarHolder = document.querySelector("#avatar")
            avatarHolder.src = user.avatar
            
            const postCard = document.createElement("div") 

            postCard.classList.add("card")
            postCard.dataset.id = post.id

                $('[data-toggle="popover-hover"]').popover({
                    html: true,
                    trigger: 'hover',
                    placement: 'bottom',
                    content: function () { return '<img src="' + $(this).data('img') + '" />'; }
                });

            postCard.innerHTML = `
                
                <div class="box stack-top">
                <h5 class="card-header">${post.title}</h5>
                    <div class="card-body">
                    <h5 class="card-title" id='username'>${currentUserName}</h5>
                    <h6 class="card-title likes" id='username'>Likes: <span>${post.likes.length}</span></h6>
                    <h6 class="card-title" id='date'><em>${post.date}</em></h6>
                    <p class="card-text">${post.content}</p>
                    <a id="popover" class="fa fa-image fa-lg" rel="popover" data-toggle="popover-hover" data-placement="bottom" data-img="${post.img_url}"></a>
                    <div class="buttons" dataset-id="${post.id}">
                        <a href="#" class="fa fa-hear fa-heart fa-lg"></a>
                        <a href="#" class="fa fa-comment fa-lg"></a>
                        <a href="#" class="fa fa-edit fa-lg"></a>
                        <a href="#" class="fa fa-trash fa-lg"></a>
                    </div>
                    <ul id="comments">
                    </ul>
                    </div>
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
          
        })
        
    }

    let commentButtonHandler = () => {
        document.addEventListener('click', function(e) {
            e.preventDefault()
            
            if (e.target.className  === "fa fa-comment fa-lg") {
                let commentUl = e.target.parentElement.parentElement.parentElement.querySelector('ul')
                
                
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
        <div class="input-group mb-3">
            <textarea class="form-control" id='post-content'placeholder="Post Content" spell-aria-label="With textarea"></textarea>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" name="new-comment-submit">Submit</button>
                </div>
        </div>
        `

        ul.append(editForm)

    }

    let likeHandler = () => {
        document.addEventListener('click', function(e) {
            // e.preventDefault()
            if (e.target.className === "fa fa-hear fa-heart fa-lg") {
                const postBox = e.target.closest("div").parentElement.parentElement
        
                postLike(postBox)
            }
        })

    }

    function postLike(postBox) {
        const postId = postBox.parentElement.dataset.id
        
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
  
            if (e.target.name === "new-comment-submit") {
                e.preventDefault()

                let newComment = e.target.parentElement.parentElement.querySelector('textarea') //.value for value
                console.log(newComment)

                postComment(newComment)
            } else if (e.target.className === "btn btn-outline-secondary editPostBtn") {
                e.preventDefault()

                let id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id
                let oldData = e.target.parentElement.parentElement.parentElement.parentElement.querySelector("p")
                let edits = e.target.parentElement.parentElement.parentElement.querySelector('.form-control').value
                
                editPost(edits, id, oldData)
            } else if (e.target.name === "new-post-submit"){
                let title = document.querySelector('#post-title'),
                    content = document.querySelector('#post-content')
                    img = document.querySelector('#basic-url')
                    newPost(title, content, img)

            } else if(e.target.name === "edit-user-submit") {
                let form = e.target.parentElement.parentElement.parentElement,
                    userEmail = form.querySelector("#user-email").value,
                    userName = form.querySelector("#user-name").value
                    userAvatar = form.querySelector("#avatar-url").value
                console.log(userAvatar)
                updateUser(form, userEmail, userName, userAvatar)    
            }

        })

    }

    function updateUser(form, userEmail, userName, userAvatar) {

        const options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                name: userName,
                email: userEmail,
                avatar: userAvatar
            })
        }

        fetch(USER_URL + currentUserId, options)
        .then(res => {
            currentUserName = userName
            form.remove()
            getUser(currentUserId)
            
            getPosts()
            //window.location.reload()
        })
    }

    const editPost=(newContent, postid, oldData)=> {
        let form = oldData.parentElement.querySelector("form")
        
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                content: newContent 
            })
        }

        fetch(URL + postid, options)
            .then(resp => {
                oldData.innerText = newContent
                form.remove()
            })
    }

    function postComment(newComment) {
        let postId = newComment.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id
 
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
                name: currentUserName
            })
        }

        fetch(COMMENTS_URL, options)
            .then(res => {
                let commentCont = document.createElement('li'),
                    commentHr = document.createElement('hr'),
                    commentName = document.createElement('p'),
                    ul = newComment.parentElement.parentElement.parentElement,
                    lastLi = ul.querySelector('.btn.btn-dark')

                    commentCont.textContent = newComment.value
                    commentName.innerHTML = `<em> - ${currentUserName}</em>`

                    ul.insertBefore(commentCont, lastLi)
                    ul.insertBefore(commentName, lastLi)
                    ul.insertBefore(commentHr, lastLi)

                    newComment.parentElement.parentElement.remove()
                    lastLi.innerText = "Add Comment"
            })
    }

    const profileHandler = () => {
        document.addEventListener('click', function(e) {
            if (e.target.textContent === "Profile") {
                
                getUser(currentUserId)

            } else if (e.target.matches("#edit-prof")) {
                let editProf = e.target
                let userName = editProf.parentElement.querySelector(".user-name").querySelector("span")
                let userEmail = editProf.parentElement.querySelector(".user-email").querySelector("span")
                
                renderEditProfile(userName, userEmail, editProf)
                editProf.id = "del-prof"

            } else if (e.target.matches("#del-prof")) {
                let editButton = e.target
                let form = editButton.nextElementSibling
                form.remove()
                editButton.id = "edit-prof"
            }
            
        })
    }

    function getUser(currentUserId) {
        fetch(USER_URL + currentUserId)
            .then(res => res.json())
            .then(user => renderUser(user))
    }

    function renderEditProfile(userName, userEmail, editProf) {
        let editProfForm = document.createElement("form")
        let avatarHolder = document.querySelector("#avatar")

        editProfForm.innerHTML = `
        <br>
        <div class="input-group mb-3">
            <input type="text" class="form-control" id='user-name' value="${userName.innerText}">
        </div>
        <div class="input-group mb-3">
                      <input type="text" class="form-control" id="avatar-url" aria-describedby="basic-addon3" value="${avatarHolder.src}">
                      <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon3">https://image.com/url/</span>
                      </div>
                    </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" id='user-email' value="${userEmail.innerText}">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" id="button-addon2" name="edit-user-submit">Edit User</button>
            </div>
        </div>
        `
        
        $(editProfForm).insertAfter(editProf)
    }

    function renderUser(user) {
        let profBox = document.querySelector(`#profile`)
        let body = profBox.querySelector(".card-body")
        currentUserName = user.name

        body.innerHTML = `
                <h6 class ="user-name" >Name: <span>${user.name}</span> </h6>
                <p class="post-count" >Number of posts: ${user.posts.length}</p>
                <br>
                <p class= "user-email" >Email: <span>${user.email}</span></p>
                <br>
                <a href="#" id="edit-prof" class="fa fa-edit fa-lg"></a>
                `
    }


    function deleteHandler() {
        document.addEventListener("click", function(e) {
            
            
            if (e.target.matches(".fa.fa-trash.fa-lg")) {
                    let cardBox = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".card-body")
                    
                        cardBox.style.opacity = .1
                        cardBox.style.backgroundColor = "gray"

                    let confirmDelete = document.createElement("button")
                        confirmDelete.classList.add("btn-warning", "btn")
                        confirmDelete.innerText = "Delete Post?"


                    let cancelDelete = document.createElement("button")
                    cancelDelete.classList.add("btn-info", "btn")
                    cancelDelete.innerText = "Cancel"

                    let cardContainer = cardBox.parentElement
                    let postHeader = cardContainer.querySelector(".card-header")

                $(cancelDelete).insertAfter(postHeader)
                $(confirmDelete).insertAfter(postHeader) 
               

            } else if (e.target.matches(".btn.btn-info")) {
                let cardBox = e.target.parentElement.parentElement.querySelector(".card-body")

                cardBox.style.opacity = ""
                cardBox.style.backgroundColor = ""
                let cancelButton = e.target.previousElementSibling
                let confirmButton = e.target
                cancelButton.remove()
                confirmButton.remove()

            } else if (e.target.matches(".btn.btn-warning")) {
                let post = e.target.parentElement.parentElement

                deletePost(post)
            }
        })
    }

    const deletePost = (post)=> {
        let postid = post.dataset.id

        const fetchOptions = {
            method: "DELETE"
        }

        fetch(URL + postid, fetchOptions)
            .then(resp => {
                post.remove()
            })
            
    }
        

    function editHandler() {
        document.addEventListener("click", function(e) {

            if (e.target.matches(".fa.fa-edit")) {

                if (document.querySelector('.form') !== null ) {
                    document.querySelector('.form').remove()
                } else {
                 let edit = document.createElement("form"),
                     buttons = e.target.parentElement.parentElement.parentElement.querySelector(".buttons"),
                     container = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".box.stack-top"),
                     content = container.querySelector("p")

                     
                    
                    edit.classList.add("form")

                 edit.innerHTML = ` 
                    <br>
                    <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <button class="btn btn-outline-secondary editPostBtn" type="button" id="button-addon1" id="">Submit</button>
                    </div>
                    <textarea class="form-control" aria-label="With textarea">${content.innerText}</textarea>
                    </div>
                 `
                $(edit).insertAfter(buttons)
                }
            }
        })
    }


    newPost=(title, content, img) => {

        function pad(n) {
            return n<10 ? '0'+n : n;
        }

        let currentDate = new Date(),
            date = currentDate.getDate(),
            month = currentDate.getMonth(),
            year = currentDate.getFullYear(),
            dateString = year + "-" + pad(month + 1) + "-" +  pad(date);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                title: title.value,
                content: content.value,
                user_id: currentUserId,
                img_url: img.value,
                date: dateString

            })
        }

        fetch(URL, options)
            .then(response => {
                    window.location.reload()
            })

    }



    editHandler()
    deleteHandler()
    commentButtonHandler()
    profileHandler()
    likeHandler()
    submitHandler()
    getPosts()

    
})

