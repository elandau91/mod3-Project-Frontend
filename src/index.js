const currentPosts = [];
let currentUserId;

document.addEventListener("DOMContentLoaded", function(e) {
    const URL = "http://localhost:3000/posts/"
    const LIKE_URL = "http://localhost:3000/likes"

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
              <h6 class="card-title likes" id='username'>Likes: ${post.likes.length}</h6>
              <h6 class="card-title" id='date'><em>${post.date}</em></h6>
              <p class="card-text">${post.content}</p>
              <div class="buttons">
                <a href="#" class="btn btn-secondary" >Comments</i></a>
                <a href="#" class="btn btn-primary" ><i class="fa fa-hear fa-heart"></i></a>
              </div>
            </div>
        `

        postContainer.append(postCard)
    }

    let likeHandler = () => {
        document.addEventListener('click', function(e) {
            e.preventDefault()
            if (e.target.className === 'btn btn-primary' || e.target.className === "fa fa-hear fa-heart") {
                const postBox = e.target.closest("div").parentElement.parentElement
                console.log(postBox)

                postLike(postBox)
            }
        })

    }

    function postLike(postBox) {
        const postId = postBox.dataset.id

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                user_id: currentUserId,
                post_id: postId
            })
        }

        // fetch(LIKE_URL, options)
        // .then(res => {
        //     getPosts()
        // })
    }

    likeHandler()
    getPosts()
})