let db = {
  users: [
    {
      userId: "V8futvsjcVOt2fV0h2M8LW6I5AC3",
      email: "chasegarsee@gmail.com",
      handle: "GarDog",
      createdAt: "2020-01-23T06:16:09.255Z",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/socialfamily-9d867.appspot.com/o/514.jpg?alt=media",
      bio: "Full Stack Developer",
      website: "chasegarsee.com",
      location: "Nashville, TN"
    }
  ],
  posts: [
    {
      userHandle: "user",
      body: "post body",
      createdAt: "2020-01-23T04:12:36.374Z",
      likeCount: "5",
      commentCount: "2"
    }
  ],
  comments: [
    {
      userHandle: "GarDog",
      postId: "0aWai34RLWyf8CjjHLit",
      body: "This is Rad!",
      createdAt: "2020-01-22T06:16:09.255Z"
    }
  ]
};

const userDetails = {
  /* REDUX DATA */
  credentials: {
    userId: "V8futvsjcVOt2fV0h2M8LW6I5AC3",
    email: "chasegarsee@gmail.com",
    handle: "GarDog",
    createdAt: "2020-01-23T06:16:09.255Z",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/socialfamily-9d867.appspot.com/o/514.jpg?alt=media",
    bio: "Full Stack Developer",
    website: "chasegarsee.com",
    location: "Nashville, TN"
  },
  likes: [
    {
      userHandle: "GarDog",
      postId: "0aWai34RLWyf8CjjHLit"
    },
    {
      userHandle: "GarDog",
      postId: "0j6Yj7FKhF11u7a8POwE"
    }
  ]
};
