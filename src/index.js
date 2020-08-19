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
        
        <div class="box stack-top">
        <h5 class="card-header">${post.title}</h5>
            <div class="card-body">
              <h5 class="card-title" id='username'>Bob</h5>
              <h6 class="card-title likes" id='username'>Likes: <span>${post.likes.length}</span></h6>
              <h6 class="card-title" id='date'><em>${post.date}</em></h6>
              <p class="card-text">${post.content}</p>
              <div class="buttons" dataset-id="${post.id}">
                <a href="#" class="btn btn-primary"><i class="fa fa-hear fa-heart"></i></a>
                <a href="#" class="btn btn-secondary"><i class="fa fa-comment"></i></a>
                <a href="#" class="btn btn-success"><i class="fa fa-edit"></i></a>
                <a href="#" class="btn btn-danger"><i class="fa fa-trash"></i></a>
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


        $(function () {
            $('[data-toggle="popover"]').popover()
        })
                
                

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
            
            if (e.target.matches(".btn.btn-secondary") || e.target.className  === "fa fa-comment") {
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
  
            if (e.target.value === "Submit") {
                e.preventDefault()
                let newComment = e.target.parentElement.querySelector('textarea') //.value for value
                console.log(newComment)

                postComment(newComment)
            } else if (e.target.className === "btn btn-outline-secondary editPostBtn") {
                e.preventDefault()

                let id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id
                let oldData = e.target.parentElement.parentElement.parentElement.parentElement.querySelector("p")
                let edits = e.target.parentElement.parentElement.parentElement.querySelector('.form-control').value
                
                editPost(edits, id, oldData)
            }

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


    function deleteHandler() {
        document.addEventListener("click", function(e) {
            
            
            if (e.target.matches(".btn.btn-danger") || e.target.matches(".fa.fa-trash")) {
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
            if (e.target.matches(".btn.btn-success") || e.target.matches(".fa.fa-edit")) {
                 let buttons = e.target.parentElement.parentElement.parentElement.querySelector(".buttons")
                 let container = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".box.stack-top")
                 let title = container.querySelector(".card-header")
                 let name = container.querySelector(".card-title")
                 let date = container.querySelector("em")
                 let content = container.querySelector("p")

                
                 let edit = document.createElement("form")
                 edit.classList.add("form")
                 edit.innerHTML = `                  
                    


                    <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <button class="btn btn-outline-secondary editPostBtn" type="button" id="button-addon1" id="">Submit</button>
                    </div>
                    <textarea class="form-control" aria-label="With textarea">${content.innerText}</textarea>
                  </div>
                 `
                $(edit).insertAfter(buttons)
                
            }
        })
    }


    newPost=()=> {

        
    }

    editHandler()
    deleteHandler()
    commentButtonHandler()
    profileHandler()
    likeHandler()
    submitHandler()
    getPosts()

    
})

