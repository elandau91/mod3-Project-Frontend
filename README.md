# mod3-Project-Frontend

Blogging App

Blogging app that allows a user to: 
- post a New blog 
- Edit a blog blog 
- Delete a blog 
- View Posts in a chronological order 
- User has many posts

MVP:
    - New post
    - Edit Post
    - Delete Post
    - View Posts
    - Like Posts

* User avatar with some sort of settings or preferences 
* Framework integration for styling (bootstrap?)
* Font Awesome or something similiar for buttons/icons, etc.
* Project will be live on AWS and accessible



Strech goals:
    - Comments

Model:
    User---<Post>---PostLike---<Like

        User:
        -Name
        -email

    Post:
        -Name
        -Date
        -Content

    PostLike:
        -PostID
        -LikeID

    Like:
        -User associated with like?
