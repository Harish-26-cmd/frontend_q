import React, { useState } from 'react';
import { ArrowLeftIcon, LocationPinIcon, MailIcon, PhoneIcon, SendIcon } from './icons';

interface ContactUsProps {
    onBack: () => void;
}

const ContactInfoItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Contact form submitted:', formData);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000); // Reset submitted state after 5s
    };
    
    return (
        <div>
             <button onClick={onBack} className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                <ArrowLeftIcon className="h-5 w-5" />
                Back
            </button>
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Contact Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Get In Touch</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            We'd love to hear from you! Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                        </p>
                        <div className="space-y-8">
                            <ContactInfoItem icon={<LocationPinIcon className="w-6 h-6" />} title="Our Office">
                                123 Innovation Drive, Tech Park, <br />
                                Metropolis, 54321
                            </ContactInfoItem>
                            <ContactInfoItem icon={<MailIcon className="w-6 h-6" />} title="Email Us">
                                <a href="mailto:support@q-free.com" className="hover:text-blue-500">support@q-free.com</a>
                            </ContactInfoItem>
                             <ContactInfoItem icon={<PhoneIcon className="w-6 h-6" />} title="Call Us">
                                <a href="tel:+1234567890" className="hover:text-blue-500">+1 (234) 567-890</a>
                            </ContactInfoItem>
                        </div>
                    </div>
                    {/* Right Side: Form */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                         {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                                     <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Thank You!</h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Your message has been sent successfully. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                             <form onSubmit={handleSubmit} className="space-y-4">
                                 <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Send us a Message</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                                    <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                    <textarea name="message" id="message" rows={4} required value={formData.message} onChange={handleChange} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <SendIcon className="w-5 h-5" />}
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
