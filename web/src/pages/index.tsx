// import Router from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Home() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   Router.push('auth');
    // }
    api.get('users/profile').then();
  }, []);

  return (
    <>
      <h1>Bem vindo, {user?.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // const apiClient = setupAPIClient(ctx);

  // const user = await apiClient.get('users/profile');

  return {
    props: {},
  };
});
