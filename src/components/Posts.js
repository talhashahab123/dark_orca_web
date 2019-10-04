import React, { PureComponent } from "react";

class Posts extends React.Component {
  componentWillMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ post: data });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      post: []
    };
  }
  render() {
    const postingData = this.state.post.map(post => (
      <div key={post.id}>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    ));
    return (
      <div>
        <h1>POSTS</h1>
        {postingData}
      </div>
    );
  }
}

export default Posts;
