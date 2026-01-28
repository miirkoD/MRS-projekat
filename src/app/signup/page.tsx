'use client';

import FacebookIcon from '@/assets/facebook-icon';
import GithubIcon from '@/assets/github-icon';
import Logo from '@/assets/logo';
import TwitterIcon from '@/assets/twitter-icon';
import InputField from '@/components/input-field';
import SocialMediaButtons from '@/components/social-media-buttons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const icons = [
  <FacebookIcon key={1} />,
  <TwitterIcon key={2} />,
  <GithubIcon key={3} />,
];

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-white gap-0 content-center justify-center">
      <div className="flex flex-col items-center content-center justify-center gap-[32px]">
        <div className="flex flex-col gap-[24px] items-center justify-center text-center ">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[35px] text-gray-900">Napravi nalog</h1>
            <span className="text-[14px] text-gray-600">
              ili{' '}
              <Link href="login">
                <span className="text-[14px] text-[#A093AA] cursor-pointer">
                  se prijavi
                </span>
              </Link>
            </span>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-[600px] w-[448px] shadow-lg  rounded-md pt-[32px] border border-gray-50 px-[40px] gap-[24px]"
        >
          <div className="flex flex-col gap-[24px]">
            <InputField
              txt="Ime"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              txt="Prezime"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <InputField
              txt="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              txt="Šifra"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[38px] text-[14px] text-white bg-[#A093AA] hover:bg-[#8f7f9a] disabled:opacity-50 rounded-md transition-colors"
          >
            {isSubmitting ? 'Registracija...' : 'Napravi nalog'}
          </button>
          <div className="flex flex-row justify-center content-center text-center items-center gap-[8px]">
            <hr className="w-[128px] h-px bg-gray-300 border-none " />
            <span className="text-gray-500 text-[14px]">Ili nastavite sa</span>
            <hr className="w-[128px] h-px bg-gray-300 border-none " />
          </div>
          <div className="flex flex-row gap-[12px] content-center items-center justify-center">
            {icons.map((icon, key) => (
              <SocialMediaButtons key={key} svg={icon} />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
