import React from 'react';
import { Card, CardContent, Typography, Box, Container, Grid } from '@mui/material';

interface User {
  id: number;
  name: string;
}

interface Post {
  userId: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        const [usersResponse, postsResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts'),
        ]);

        if (!usersResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersResponse.json();
        const postsData = await postsResponse.json();

        setUsers(usersData);
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users and posts.');
        setLoading(false);
      }
    };

    fetchUsersAndPosts();
  }, []);

  const getPostCount = (userId: number) => {
    return posts.filter(post => post.userId === userId).length;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <Grid container spacing={3}>
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                borderRadius: '15px',
                color: 'white',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">
                  {getPostCount(user.id)} posts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserList;