import { NextPage } from 'next';
import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../utils/api';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {
  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api);

  return (
    <div>
      <Nav />
      {!session && (
        <div className="text-3xl">
          <h1>Favor fazer login para acessar esta página</h1>
          Not signed in <br />
          <button onClick={(): Promise<void> => signIn('auth0')}>
            Sign in
          </button>
        </div>
      )}
      {session && data && (
        <>
          <div className="text-3xl">
            <h1>Bem vindo à página PROFILE</h1>
            Signed in as {session.user.email} <br />
            <button onClick={(): Promise<void> => signOut()}>Sign out</button>
          </div>
          <p>{data.data.name}</p>
          <p>{data.data.coins} moedas</p>
        </>
      )}
      {error && <h1>O usuário com email {session?.user.email} não existe</h1>}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
