'use client';

import { useState, useRef } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import './contact-form.css';

interface ContactFormProps {
  lang: {
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
    };
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      subjectRequired: string;
      messageRequired: string;
    };
    success: {
      title: string;
      message: string;
    };
    error: {
      title: string;
      message: string;
      turnstile: string;
    };
  };
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstile?: string;
}

export function ContactForm({ lang }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileInstance>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = lang.validation.nameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = lang.validation.emailRequired;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = lang.validation.emailInvalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = lang.validation.subjectRequired;
    }

    if (!formData.message.trim()) {
      newErrors.message = lang.validation.messageRequired;
    }

    if (!turnstileToken) {
      newErrors.turnstile = lang.error.turnstile;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setTurnstileToken('');
        turnstileRef.current?.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

  return (
    <div className="contact-form-container">
      {submitStatus === 'success' && (
        <div className="alert alert-success">
          <div className="alert-title">{lang.success.title}</div>
          <div className="alert-message">{lang.success.message}</div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-error">
          <div className="alert-title">{lang.error.title}</div>
          <div className="alert-message">{lang.error.message}</div>
        </div>
      )}

      {submitStatus !== 'success' && (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {lang.form.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={lang.form.namePlaceholder}
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {lang.form.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={lang.form.emailPlaceholder}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              {lang.form.subject}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={lang.form.subjectPlaceholder}
              className={`form-input ${errors.subject ? 'error' : ''}`}
            />
            {errors.subject && (
              <span className="form-error">{errors.subject}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              {lang.form.message}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={lang.form.messagePlaceholder}
              className={`form-textarea ${errors.message ? 'error' : ''}`}
            />
            {errors.message && (
              <span className="form-error">{errors.message}</span>
            )}
          </div>

          <div className="turnstile-container">
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setErrors((prev) => {
                  const { turnstile: _turnstile, ...rest } = prev;
                  return rest;
                });
              }}
              onError={() => {
                setTurnstileToken('');
              }}
              onExpire={() => {
                setTurnstileToken('');
              }}
            />
          </div>
          {errors.turnstile && (
            <div className="form-error" style={{ textAlign: 'center', marginTop: '-0.5rem' }}>
              {errors.turnstile}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? lang.form.sending : lang.form.submit}
          </button>
        </form>
      )}
    </div>
  );
}
