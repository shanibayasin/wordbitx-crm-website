'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type AuthMode = 'register' | 'sign-in';

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const router = useRouter();
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegister) {
      setNotice('Workspace registration is not enabled. Use the configured demo sign-in.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    setNotice('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setNotice(result.error || 'Unable to sign in. Check your credentials and try again.');
        return;
      }

      router.replace('/dashboard/overview');
      router.refresh();
    } catch {
      setNotice('Unable to reach the sign-in service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page-inner">
        <header className="auth-brand-row">
          <Link className="auth-brand" href="/" aria-label="WordbitX CRM home">
            <span className="auth-brand-mark" aria-hidden="true">W</span>
            <span className="auth-brand-copy">
              <strong>WordbitX</strong>
              <small>CRM</small>
            </span>
          </Link>
        </header>

        <div className="auth-card">
          <section className="auth-main" aria-labelledby="auth-title">
            <p className="auth-eyebrow">{isRegister ? 'CREATE YOUR WORKSPACE' : 'WELCOME BACK'}</p>
            <h1 id="auth-title">
              {isRegister ? 'Start with your company, then make it yours.' : 'Welcome back to your workspace.'}
            </h1>
            <p className="auth-intro">
              {isRegister
                ? 'Your CRM workspace starts with an owner account. You can invite your team and configure workflows from settings.'
                : 'Sign in to continue with your team, customer records and sales workflows.'}
            </p>

            <form className={`auth-form${isRegister ? ' auth-form-register' : ' auth-form-signin'}`} onSubmit={handleSubmit}>
              <div className="auth-fields">
                {isRegister && (
                  <label className="auth-field">
                    <span>Your name</span>
                    <input autoComplete="name" name="name" required />
                  </label>
                )}

                <label className="auth-field">
                  <span>Work email</span>
                  <input autoComplete="email" name="email" required type="email" />
                </label>

                {isRegister && (
                  <label className="auth-field">
                    <span>Company name</span>
                    <input autoComplete="organization" name="company" required />
                  </label>
                )}

                {isRegister && (
                  <label className="auth-field">
                    <span>Industry</span>
                    <select defaultValue="Software & IT Services" name="industry" required>
                      <option>Software &amp; IT Services</option>
                      <option>Financial Services</option>
                      <option>Healthcare</option>
                      <option>Professional Services</option>
                      <option>Retail &amp; E-commerce</option>
                      <option>Manufacturing</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </label>
                )}

                {isRegister && (
                  <label className="auth-field">
                    <span>Team size</span>
                    <select defaultValue="1–10" name="teamSize" required>
                      <option>1–10</option>
                      <option>11–50</option>
                      <option>51–200</option>
                      <option>201–500</option>
                      <option>501+</option>
                    </select>
                  </label>
                )}

                <label className="auth-field">
                  <span>{isRegister ? 'Create password' : 'Password'}</span>
                  <input
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    minLength={8}
                    name="password"
                    required
                    type="password"
                  />
                </label>
              </div>

              {isRegister ? (
                <label className="auth-consent">
                  <input name="consent" required type="checkbox" />
                  <span>I agree to create a secure business workspace and receive essential account communications.</span>
                </label>
              ) : (
                <label className="auth-consent auth-remember">
                  <input name="remember" type="checkbox" />
                  <span>Remember me on this device</span>
                </label>
              )}

              <button className="auth-submit" disabled={isSubmitting} type="submit">
                {isRegister ? 'Create secure workspace' : isSubmitting ? 'Signing in…' : 'Sign in'}
                <ArrowRight size={16} />
              </button>

              {notice && <p className="auth-notice" role="status">{notice}</p>}
            </form>

            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : 'New to WordbitX?'}{' '}
              <Link href={isRegister ? '/sign-in' : '/register'}>
                {isRegister ? 'Sign in' : 'Start free trial'}
              </Link>
            </p>
          </section>

          <aside className="auth-aside">
            {isRegister ? (
              <>
                <p className="auth-eyebrow auth-eyebrow-light">WHAT HAPPENS NEXT</p>
                <ol className="auth-steps">
                  <li>
                    <span>01</span>
                    <div><strong>Create company</strong><p>Your organization becomes a tenant-isolated workspace.</p></div>
                  </li>
                  <li>
                    <span>02</span>
                    <div><strong>Set your operation</strong><p>Choose industry, team size and configure your CRM foundation.</p></div>
                  </li>
                  <li>
                    <span>03</span>
                    <div><strong>Invite and execute</strong><p>Add your team, define access and start working from a shared customer record.</p></div>
                  </li>
                </ol>
                <p className="auth-aside-note"><CheckCircle2 size={15} /> Account setup will be available when authentication is enabled.</p>
              </>
            ) : (
              <>
                <p className="auth-eyebrow auth-eyebrow-light">YOUR WORKSPACE</p>
                <h2>Pick up where your team left off.</h2>
                <ol className="auth-steps">
                  <li>
                    <span>01</span>
                    <div><strong>Review your pipeline</strong><p>See deals, owners and next steps in one place.</p></div>
                  </li>
                  <li>
                    <span>02</span>
                    <div><strong>Stay close to customers</strong><p>Keep conversations and account details connected.</p></div>
                  </li>
                  <li>
                    <span>03</span>
                    <div><strong>Move work forward</strong><p>Bring follow-ups and team activity into focus.</p></div>
                  </li>
                </ol>
                <p className="auth-aside-note"><CheckCircle2 size={15} /> Demo access uses a shared configured account.</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}