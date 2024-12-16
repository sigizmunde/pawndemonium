import { useContext, useState } from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../userContext';
import Modal from '../modal';
import './login.scss';

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user;

  const handleLogOut = () => {
    setUser(null);
  };

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
    const credential = credentialResponse.credential!;
    const decodedToken = jwtDecode(credential);
    setUser(decodedToken);
    setShowForm(false);
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
