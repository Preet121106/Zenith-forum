
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostAuthor, setNewPostAuthor] = useState("Zenith User");
  const [newPostTags, setNewPostTags] = useState("");

  useEffect(() => {
    // Mock data for initial posts
    const initialPosts: Post[] = [
      {
        id: generateRandomId(),
        author: "Zenith User 1",
        content: "First post! Welcome to Zenith Echo!",
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        tags: ["welcome", "first"],
      },
      {
        id: generateRandomId(),
        author: "Zenith User 2",
        content: "Sharing my thoughts on the latest tech trends.",
        timestamp: new Date().toISOString(),
        likes: 2,
        comments: [
          {
            id: generateRandomId(),
            author: "Zenith User 1",
            content: "Interesting!",
            timestamp: new Date().toISOString(),
          },
        ],
        tags: ["tech", "trends"],
      },
    ];
    setPosts(initialPosts);
  }, []);

  const handleCreatePost = () => {
    if (newPostContent.trim() === "") return;

    const tagsArray = newPostTags.split(",").map((tag) => tag.trim());

    const newPost: Post = {
      id: generateRandomId(),
      author: newPostAuthor,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      tags: tagsArray,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostTags("");
  };

  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    if (commentContent.trim() === "") return;

    const newComment: Comment = {
      id: generateRandomId(),
      author: "Zenith User",
      content: commentContent,
      timestamp: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const handleSharePost = (postId: string) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  };

  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const handleCommentInputChange = (postId: string, content: string) => {
    setCommentInput((prev) => ({ ...prev, [postId]: content }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Zenith Echo</h1>

      {/* Post Creation */}
      <Card className="mb-4 bg-white">
        <CardHeader>
          <Label htmlFor="author">Zenith User</Label>
          <Input
            id="author"
            type="text"
            value={newPostAuthor}
            onChange={(e) => setNewPostAuthor(e.target.value)}
            className="mb-2"
          />
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            type="text"
            value={newPostTags}
            onChange={(e) => setNewPostTags(e.target.value)}
            className="mb-2"
          />
        </CardHeader>
        <CardContent>
          <Label htmlFor="content">Post Content</Label>
          <Textarea
            id="content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleCreatePost} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Create Post
          </Button>
        </CardContent>
      </Card>

      {/* Post Display */}
      <div>
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 bg-white">
            <CardHeader>
              <div className="font-bold">{post.author}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(post.timestamp).toLocaleString()}
              </div>
              <div>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <div className="flex items-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikePost(post.id)}
                  className="mr-2"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Like ({post.likes})
                </Button>
                <Button variant="ghost" size="sm" className="mr-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.comments.length} Comments
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleSharePost(post.id)}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Comments Section */}
              <div className="mt-4">
                <h3 className="text-sm font-bold mb-2">Comments</h3>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="mb-2 p-2 rounded-md bg-muted">
                    <div className="text-xs font-bold">{comment.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleString()}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}

                {/* Add Comment Input */}
                <div className="mt-2">
                  <Textarea
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      handleCommentInputChange(post.id, e.target.value)
                    }
                    placeholder="Add a comment..."
                    className="mb-2 text-sm"
                  />
                  <Button
                    onClick={() =>
                      handleAddComment(post.id, commentInput[post.id] || "")
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/80 text-sm"
                    size="sm"
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
