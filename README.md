# mod3-Project-Frontend

Blogging App

Blogging app that allows a user to: 
- post a New blog 
- Edit a blog blog 
- Delete a blog 
- View Posts in a chronological order 
- User has many posts
- A Post has many Likes
- A Post belongs to a User

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
    User---<Like>---<Post
    -Like is the joiner


        User:
        -Name
        -email

    Post:
        -Name
        -Date
        -Content
    

    Like:
        -User associated with like?
        -postId
        -userId


