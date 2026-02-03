'use client';

export function LogoutButton() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/';
  };
  return <button onClick={logout}>Disconnect</button>;
}
