import { useContext, useState } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { authenticateWithGoogle, logout } from '../../app/server/auth';
import { UserContext } from '../userContext';
import Modal from '../modal';
import './login.scss';

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;

  const handleLogOut = async () => {
    await logout();
    setUser(null);
  };

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    try {
      const credential = credentialResponse.credential!;

      const authUser = await authenticateWithGoogle(credential);

      setUser(authUser);

      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button type="button" className="log-in-button" onClick={() => setShowForm(true)}>
        {!!isLoggedIn ? user.email : 'log in'}
      </button>
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          {isLoggedIn && (
            <button type="button" className="gapped-button" onClick={handleLogOut}>
              Log out
            </button>
          )}
          {!isLoggedIn && (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
                setShowForm(false);
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
}
