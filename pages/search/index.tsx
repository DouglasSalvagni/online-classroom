import { NextPage } from 'next';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../../utils/api';
import Nav from '../../components/nav';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: Record<string, unknown>[];
}

const SearchPage: NextPage = () => {
  const [session, loading] = useSession();
  const [data, setData] = useState<Teacher[]>([]);
  const [textInput, setTextInput] = useState<string>();

  const handleSearch = useCallback(() => {
    console.log('teste');
    api(`/api/search/${textInput}`).then((response) => {
      const teachers: Teacher[] = response.data;

      setData(teachers);
    });
  }, [textInput]);

  return (
    <div>
      <Nav />
      <h1>Bem vindo à página SEARCH</h1>
      {!session && (
        <div className="text-3xl">
          Not signed in <br />
          <button onClick={(): Promise<void> => signIn('auth0')}>
            Sign in
          </button>
        </div>
      )}
      {session && (
        <>
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button onClick={(): Promise<void> => signOut()}>Sign out</button>
          </div>
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            type="text"
            placeholder="Nome da matéria"
            className="bg-pink-200"
          />
          <button type="submit" className="bg-blue-200" onClick={handleSearch}>
            Pesquisar
          </button>
          {data &&
            data.length !== 0 &&
            data.map((teacher) => {
              return (
                <Link href={'/search/' + teacher._id} key={teacher._id}>
                  <a>
                    <h1 className="text-2xl">{teacher.name}</h1>
                  </a>
                </Link>
              );
            })}
        </>
      )}
      {loading && (
        <div className="text-5xl">
          <h1>CARREGANDO</h1>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
